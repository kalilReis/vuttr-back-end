import { Router } from 'express'

import UserController from './controllers/UserController'
import ToolController from './controllers/ToolController'

const routes = Router()

const userController = new UserController()
routes.get('/users', userController.get)
routes.post('/users', userController.create)

const toolController = new ToolController()
routes.post('/tools', toolController.create)
routes.get('/tools', toolController.get)
routes.delete('/tools/:id', toolController.delete)

export default routes
