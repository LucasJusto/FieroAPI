import { User } from "../Model/User.js";
import {
  createQueryBuilder,
  EntityRepository,
  getCustomRepository,
  Repository,
} from "typeorm";
import { VerificationCode } from "../Model/VerificationCode.js";

export class UserRepository {
  async insert(user: User) {
    const userRep = getCustomRepository(TORMUserRepository);
    const createdUser = await userRep.save(user);
    return new User(
      createdUser.id,
      createdUser.email,
      createdUser.name,
      undefined,
      undefined,
      createdUser.createdAt,
      createdUser.updatedAt
    );
  }

  async getUserByEmail(email: string) {
    const userRep = getCustomRepository(TORMUserRepository);
    const userFromDB = await userRep
            .createQueryBuilder('user')
            .select('user.password')
            .addSelect('user.salt')
            .addSelect('user.email')
            .addSelect('user.name')
            .addSelect('user.id')
            .addSelect('user.createdAt')
            .addSelect('user.updatedAt')
            .where('user.email = :email', { email })
            .getOne()
    const user = new User(
      userFromDB?.id || "",
      userFromDB?.email || "",
      userFromDB?.name || "",
      userFromDB?.password,
      userFromDB?.salt,
      userFromDB?.createdAt,
      userFromDB?.updatedAt
    );

    return user;
  }

  async deleteVerificationCodeByUserId(userId: string) {
    const verificationCodeRep = getCustomRepository(TORMVerificationCodeRepository)
    return verificationCodeRep
      .createQueryBuilder()
      .delete()
      .from(VerificationCode)
      .where("owner_id = :id", { id: userId })
      .execute();
  }

  async update(user: User) {
    const userRep = getCustomRepository(TORMUserRepository)
    return await userRep.save(user)
  }

  async getVerificationCodeById(id: string) {
    const verificationCodeRep = getCustomRepository(TORMVerificationCodeRepository)
    return await verificationCodeRep.findOne(id)
  }

  async insertVerificationCodeForUser(verificationCode: VerificationCode) {
    const verificationCodeRep = getCustomRepository(TORMVerificationCodeRepository)
    return await verificationCodeRep.save(verificationCode)
  }

  async getUserById(id: string) {
    const userRep = getCustomRepository(TORMUserRepository);
    const userFromDB = await userRep.findOne({ where: { id: id } });

    const user = new User(
      userFromDB?.id || "",
      userFromDB?.email || "",
      userFromDB?.name || "",
      undefined,
      undefined,
      userFromDB?.createdAt,
      userFromDB?.updatedAt
    );

    return user;
  }

  async deleteVerificationCode(verificationCode: VerificationCode) {
    const verificationCodeRep = getCustomRepository(TORMVerificationCodeRepository)

    await verificationCodeRep.remove(verificationCode);
  }

  async wipeUserData(user: User) {
    const repository = getCustomRepository(TORMUserRepository);
    const newEmail = user.id + "@fiero.com";
    await repository
      .createQueryBuilder()
      .update(user)
      .set({ name: "Fiero User", email: newEmail, password: "" })
      .where("id = :id", { id: user.id })
      .execute();
  }
}

@EntityRepository(User)
class TORMUserRepository extends Repository<User> {}

@EntityRepository(VerificationCode)
class TORMVerificationCodeRepository extends Repository<VerificationCode> {}
