import { Router } from 'express'

const router = Router()

router.get('/', (req, res) => {
    res.send('Hello World!')
})

router.get('/oi', (req, res) => {
    res.send("alo alo")
})

export default router