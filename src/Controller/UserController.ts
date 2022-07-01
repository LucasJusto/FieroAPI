import { Request, Response } from 'express'
import { HTTPCodes } from '../utils/HTTPEnum'
import { UserService } from '../Service/UserService'
import { checkParamsTypes } from '../utils/CheckParamsTypes'

export class UserController {
    userService = new UserService()

    async handlePost(request: Request, response: Response) {
        const { email, password, name} = request.body
        //checking if paramaters exist
        if (!email) {
            return response.status(HTTPCodes.BadRequest).json({message: 'email not sent'})
        }
        if (!password) {
            return response.status(HTTPCodes.BadRequest).json({message: 'password not sent'})
        }
        if (!name) {
            return response.status(HTTPCodes.BadRequest).json({message: 'name not sent'})
        }

        //checking parameters types
        const namesOfWrongParameters = checkParamsTypes(['email', email, 'string'])
    }
}