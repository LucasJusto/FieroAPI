import { User } from '../Model/User.js'
import { createQueryBuilder, EntityRepository, getCustomRepository, Repository} from 'typeorm'



export class UserRepository {

    async insert(user: User) {
        const userRep = getCustomRepository(TORMUserRepository)
        const createdUser = await userRep.save(user)
        return new User(createdUser.id, createdUser.email, createdUser.name, undefined, undefined, createdUser.createdAt, createdUser.updatedAt)
    }

    async getUserByEmail(email: string) {
        const userRep = getCustomRepository(TORMUserRepository)
        const userFromDB = await userRep
            .createQueryBuilder()
            .select("user")
            .from(User, "user")
            .where("user.email = :email", { email: email })
            .getOne()

        const user = new User(userFromDB?.id || "", userFromDB?.email || "", userFromDB?.name || "", userFromDB?.password, userFromDB?.salt, userFromDB?.createdAt, userFromDB?.updatedAt )

        return user
    }

    async getUserById(id: string) {
        const userRep = getCustomRepository(TORMUserRepository)
        const userFromDB = await userRep
            .createQueryBuilder()
            .select("user")
            .from(User, "user")
            .where("user.id = :id", { id: id })
            .getOne()

        const user = new User(userFromDB?.id || "", userFromDB?.email || "", userFromDB?.name || "", undefined, undefined, userFromDB?.createdAt, userFromDB?.updatedAt )

        return user
    }
}

@EntityRepository(User)
class TORMUserRepository extends Repository<User> {}
