import { User } from '../Model/User.js'
import { createQueryBuilder, EntityRepository, getCustomRepository, Repository} from 'typeorm'

export class UserRepository {
    async insert(user: User) {
        const userRep = getCustomRepository(TORMUserRepository)

        await userRep
            .createQueryBuilder()
            .insert()
            .into(User)
            .values([
                { id: user.id, email: user.email, name: user.name, password: user.password }
            ])
            .execute()
    }
}

@EntityRepository(User)
class TORMUserRepository extends Repository<User> {}
