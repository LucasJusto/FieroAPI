import { User } from '../Model/User.js'
import { UserRepository } from '../Repository/UserRepository.js'
import jwt from 'jsonwebtoken'
import variables from '../config/EnviromentVariables.js'

export class UserService {
    async createAccount(user: User) {
        const userRepository = new UserRepository()

        await userRepository.insert(user)
    }

    async getUserAuthToken(email: string, password: string) {
        const userRepository = new UserRepository()

        const user = await userRepository.getUserByEmail(email)
        if(user.email == email) {
            if (user.password == password) {
                //return token and user
                const id = user.id
                const secretKey = variables.USER_AUTH_TOKEN_KEY as string
                const token = jwt.sign({id}, secretKey, {
                    expiresIn: variables.USER_AUTH_TOKEN_EXPIRE_TIME,
                  })

                return [token, user]
            }
            else {
                //wrong password error
                throw new Error('wrong password')
            }
        }
        else {
            //user doesnt exist error
            throw new Error('user not found')
        }
    }
}