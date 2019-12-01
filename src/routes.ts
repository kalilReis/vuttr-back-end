import { Router } from 'express'

import UserController from './controllers/UserController'
import ToolController from './controllers/ToolController'

const routes = Router()

routes.get('/users', new UserController().get)
routes.post('/users', new UserController().create)

routes.post('/tools', new ToolController().create)
routes.get('/tools', new ToolController().get)
export default routes
