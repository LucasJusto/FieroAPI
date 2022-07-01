import { Router } from 'express'
import { UserController } from './Controller/UserController'
import { Request, Response } from 'express'

const router = Router()
const userController = new UserController()

router.get('/', (req, res) => {
    res.send('Hello World!')
})

//USER ROUTES
router.post('/user', (req, res) => {
    userController.handlePost(req, res)
})

export default router