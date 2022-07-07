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

    async handleGetAuth(req: Request, res: Response) {
        try {
            const ret = await userService.getUserAuthToken(req.body.email, req.body.password)
            res.status(HTTPCodes.Success).json({ token: ret[0], user: ret[1] })
        } catch (error) {
            switch (error.message) {
                case 'wrong password':
                    res.status(HTTPCodes.Forbidden).json(error.message)
                    return
                case 'user not found':
                    res.status(HTTPCodes.NotFound).json(error.message)
                    return
                default:
                    res.status(HTTPCodes.InternalServerError).json(error)
                    return
            }
        }
    }
}