import { User } from "../Model/User.js"
import { UserRepository } from "../Repository/UserRepository.js"
import jwt from "jsonwebtoken"
import variables from "../config/EnviromentVariables.js"
import bcrypt from "bcrypt"
import crypto from "crypto"
import { VerificationCode } from "../Model/VerificationCode.js"
import uuidV4 from "../utils/uuidv4Generator.js"

const userRepository = new UserRepository();

export class UserService {
  async createAccount(user: User) {
    const salt = await bcrypt.genSalt();
    const encryptedPassword = crypto
      .createHash("md5")
      .update(user.password + salt)
      .digest("hex");
    const userToCreate = new User(
      user.id,
      user.email,
      user.name,
      encryptedPassword,
      salt
    );

    return await userRepository.insert(userToCreate);
  }

  async createVerificationCodeForUser(userId: string) {
    const verificationCode = new VerificationCode(uuidV4(), userId)
    return await userRepository.insertVerificationCodeForUser(verificationCode)
  }

  async getUserById(id: string) {
    return await userRepository.getUserById(id)
  }

  async getUserByEmail(email: string) {
    return await userRepository.getUserByEmail(email)
  }

  async wipeUserData(user: User) {
    return await userRepository.wipeUserData(user);
  }

  async getUserAuthToken(email: string, password: string) {
    const user = await userRepository.getUserByEmail(email);
    if (user.email == email) {
      const encryptedPassword = crypto
        .createHash("md5")
        .update(password + user.salt)
        .digest("hex");
      if (user.password == encryptedPassword) {
        //return token and user
        const id = user.id;
        const secretKey = variables.USER_AUTH_TOKEN_KEY as string;
        const token = jwt.sign({ id }, secretKey, {
          expiresIn: variables.USER_AUTH_TOKEN_EXPIRE_TIME,
        });
        const userWithoutPassword = new User(
          user.id,
          user.email,
          user.name,
          undefined,
          undefined,
          user.createdAt,
          user.updatedAt
        );
        return [token, userWithoutPassword];
      } else {
        //wrong password error
        throw new Error(UserLoginErrors.wrongEmailPasswordCombination);
      }
    } else {
      //user doesnt exist error
      throw new Error(UserLoginErrors.userNotFound);
    }
  }
}

export enum UserLoginErrors {
  wrongEmailPasswordCombination = "wrong email + password combination",
  userNotFound = "user not found",
}
