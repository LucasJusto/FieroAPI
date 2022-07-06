import { User } from '../Model/User.js'
import { UserRepository } from '../Repository/UserRepository.js'

const userRepository = new UserRepository()

export class UserService {
    async createAccount(user: User) {
        await userRepository.insert(user)
    }

    async getUserAuthToken(email: string, password: string) {
        
    }
}