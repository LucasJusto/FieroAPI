import { Router } from 'express'
import { validate } from './Middleware/validate.js'
import { body, param } from 'express-validator'
import { UserController } from './Controller/UserController.js'

const router = Router()
const userController = new UserController()

router.get('/', (req, res) => {
    res.send('Hello World!')
})

//USER ROUTES
router.post('/user/register',
    validate([
        body('email').isEmail(),
        body('password').isString().notEmpty(),
        body('name').isString().notEmpty()
    ]),
    async (req, res) => {
        userController.handlePost(req, res)
    }
)

router.post('/user/login', 
    validate([
        body('email').isEmail(),
        body('password').isString().notEmpty()
    ]),
    async (req, res) => {
        userController.handleGetAuth(req,res)
    }
)

export default router