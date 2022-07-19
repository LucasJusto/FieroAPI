import { Router } from 'express'
import { validate } from './Middleware/validate.js'
import { body, param } from 'express-validator'
import { Request, Response } from 'express'
import { UserController } from './Controller/UserController.js'
import { QuickChallengeController } from './Controller/QuickChallengeController.js'
import { authToken } from './Middleware/auth.js'

const router = Router()
const userController = new UserController()
const quickChallengeController = new QuickChallengeController()

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
        userController.handleRegister(req, res)
    }
)

router.post('/user/login', 
    validate([
        body('email').isEmail(),
        body('password').isString().notEmpty()
    ]),
    async (req, res) => {
        userController.handleLogin(req,res)
    }
)


//QUICK CHALLENGE ROUTES
router.post('/quickChallenge/create',[ 
    authToken(), validate([
        body('name').isString().notEmpty(),
        body('type').isString().notEmpty(),
        body('goal').isNumeric(),
        body('goalMeasure').isString().notEmpty(),
        body('userId').isString().notEmpty()
    ])],
    async (req: Request, res: Response) => {
        quickChallengeController.createChallenge(req, res)
    }
)

export default router