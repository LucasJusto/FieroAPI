import { User } from '../Model/User.js'
import { UserRepository } from '../Repository/UserRepository.js'
import jwt from 'jsonwebtoken'
import variables from '../config/EnviromentVariables.js'

export class UserService {
    async createAccount(user: User) {
        const userRepository = new UserRepository()

        return await userRepository.insert(user)
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
                const userWithoutPassword = new User(user.id, user.email, user.name, undefined, user.createdAt, user.updatedAt)
                return [token, userWithoutPassword]
            }
            else {
                //wrong password error
                throw new Error(UserLoginErrors.wrongEmailPasswordCombination)
            }
        }
        else {
            //user doesnt exist error
            throw new Error(UserLoginErrors.userNotFound)
        }
    }
}

export enum UserLoginErrors {
    wrongEmailPasswordCombination = 'wrong email + password combination',
    userNotFound = 'user not found'
}