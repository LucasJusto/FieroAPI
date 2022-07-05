import { User } from '../Model/User.js'
import { UserService } from '../Service/UserService.js'
import uuidV4 from '../utils/uuidv4Generator.js'
import { HTTPCodes } from '../utils/HTTPEnum.js'
import { Request, Response } from 'express'

const userService = new UserService()

export class UserController {
    async handlePost(req: Request, res: Response) {
        const { email, name, password } = req.body
        const user = new User(uuidV4(), email, name, password)

        try {
            await userService.createAccount(user)
            res.status(HTTPCodes.Success).json({ message: user })

        } catch (error) {
            console.log(error.code)
            switch (error.code) {
                case '23505': 
                    //trying to duplicate an unique key
                    res.status(HTTPCodes.Conflict).json(error.message)
                    return;
                default:
                    res.status(HTTPCodes.InternalServerError).json(error.message)
                    return;
            }
        }
    }
}