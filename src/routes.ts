import { Router } from 'express'
import UserController from './controllers/UserController'
import ToolController from './controllers/ToolController'
import AuthController from './controllers/AuthController'

const routes = Router()

routes.post('/login', AuthController.login)

routes.post('/users', UserController.create)

routes.use('/tools', AuthController.authJWT)
routes.post('/tools', ToolController.create)
routes.get('/tools', ToolController.get)
routes.delete('/tools/:id', ToolController.delete)

export default routes
