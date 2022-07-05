import { Router } from 'express'
import { validate } from './utils/validate.js'
import { body } from 'express-validator'
import { UserService } from './Service/UserService.js'
import { User } from './Model/User.js'
import uuidV4 from './utils/uuidv4Generator.js'
import { HTTPCodes } from './utils/HTTPEnum.js'

const router = Router()
const userService = new UserService()

router.get('/', (req, res) => {
    res.send('Hello World!')
})

//USER ROUTES
router.post('/user',
    validate([
        body('email').isEmail(),
        body('password').isString().notEmpty(),
        body('name').isString().notEmpty()
    ]),
    async (req, res) => {
        const { email, name, password } = req.body
        const user = new User(uuidV4(), email, name, password)

        try {
            await userService.createAccount(user)
            res.status(HTTPCodes.Success).json({ message: user })

        } catch (error) {
            console.log(error.code)
            switch (error.code) {
                case 23505: 
                    //trying to duplicate an unique key
                    res.status(HTTPCodes.BadRequest).json(error.message)
                    return
                default:
                    res.status(HTTPCodes.InternalServerError).json(error.message)
            }
            
        }
    }
)

export default router