import { Router } from 'express'
import { validate } from './utils/validate.js'
import { body } from 'express-validator'
import { UserController } from './Controller/UserController.js'

const router = Router()
const userController = new UserController()

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
        userController.handlePost(req, res)
    }
)

export default router