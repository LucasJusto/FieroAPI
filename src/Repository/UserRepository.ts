import { User } from '../Model/User.js'
import { createQueryBuilder, EntityRepository, getCustomRepository, Repository} from 'typeorm'



export class UserRepository {
    userRep = getCustomRepository(TORMUserRepository)

    async insert(user: User) {
        await this.userRep
            .createQueryBuilder()
            .insert()
            .into(User)
            .values([
                { id: user.id, email: user.email, name: user.name, password: user.password }
            ])
            .execute()
    }

    async getUserByEmail(email: string) {
        const userFromDB = await this.userRep
            .createQueryBuilder()
            .select("user")
            .from(User, "user")
            .where("user.email = :email", { email: email })
            .getOne()

        const user = new User(userFromDB?.id || "", userFromDB?.email || "", userFromDB?.name || "", userFromDB?.password, userFromDB?.createdAt, userFromDB?.updatedAt )

        return user
    }
}

@EntityRepository(User)
class TORMUserRepository extends Repository<User> {}
