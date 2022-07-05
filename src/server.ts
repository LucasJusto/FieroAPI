import express from 'express'
import router from './routes.js'

class App {
	server: express.Express
	constructor() {
		this.server = express()
		this.server.use(express.json())
		this.server.use(router)
	}
}

export default new App().server
