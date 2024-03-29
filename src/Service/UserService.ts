import { User } from "../Model/User.js"
import { UserRepository } from "../Repository/UserRepository.js"
import jwt from "jsonwebtoken"
import variables from "../config/EnviromentVariables.js"
import bcrypt from "bcrypt"
import crypto from "crypto"
import { VerificationCode } from "../Model/VerificationCode.js"
import uuidV4 from "../utils/uuidv4Generator.js"
import e from "express"
import sgMail from "@sendgrid/mail"

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
    await userRepository.deleteVerificationCodeByUserId(userId)
    return await userRepository.insertVerificationCodeForUser(verificationCode)
  }

  async getUserById(id: string) {
    return await userRepository.getUserById(id)
  }

  async getUserByEmail(email: string) {
    return await userRepository.getUserByEmail(email)
  }

  async checkVerificationCode(verificationCode: string, email: string) {
    const verificationCodeFromRep = await userRepository.getVerificationCodeById(verificationCode)
    if(!verificationCodeFromRep) {
      return false
    }
    //checking verificationCode expirationDate
    const createdAt = verificationCodeFromRep.createdAt
    const distanceFromCreatedAt = Date.UTC(createdAt.getUTCFullYear(), createdAt.getUTCMonth(), createdAt.getUTCDate(), createdAt.getUTCHours(), createdAt.getUTCMinutes(), createdAt.getUTCSeconds())
    const distanceFromNow = Date.now()
    const verificationCodeAgeInHours = (distanceFromNow-distanceFromCreatedAt)/1000/60/60
    const verificationCodeMaxDurationInHours = 24

    if(verificationCodeAgeInHours < verificationCodeMaxDurationInHours) {
      const user = await userRepository.getUserByEmail(email)
      if(user.email = email) {
        return true
      }
    }
    else {
      await userRepository.deleteVerificationCode(verificationCodeFromRep)
    }
    return false
  }

  async sendMail(email: string, verificationCode: VerificationCode) {
    if(variables.SENDGRID_API_KEY) {
      sgMail.setApiKey(variables.SENDGRID_API_KEY)

      const msg = {
        to: email,
        from: 'fieroappcontato@gmail.com',
        subject: 'Fiero - Verification Code',
        text: 'Se lembrar senhas fosse um desafio, todos nós seríamos perdedores. Utilize o código '+verificationCode.id+' dentro do Fiero para realizar a troca da sua senha.',
        html: '<p>Se lembrar senhas fosse um desafio, todos nós seríamos perdedores.</p>'+'<p>Utilize o código <strong>'+verificationCode.id+'</strong> dentro do Fiero para realizar a troca da sua senha.</p>',
      }
  
      sgMail
        .send(msg)
        .then((response) => {
        })
        .catch((error) => {
        })
    }
  }

  async patchPassword(email: string, newPassword: string) {
    const user = await userRepository.getUserByEmail(email)
    const encryptedPassword = crypto
      .createHash("md5")
      .update(newPassword + user.salt)
      .digest("hex");
    user.password = encryptedPassword
    const patchedUser = await userRepository.update(user)
    patchedUser.password = ''
    patchedUser.salt = ''
    await userRepository.deleteVerificationCodeByUserId(user.id)

    return patchedUser
  }

  async handleAccountDeletion(user: User) {
    return await userRepository.handleAccountDeletion(user);
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
