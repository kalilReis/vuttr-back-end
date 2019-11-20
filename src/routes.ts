import { Router } from 'express'

import UserController from './controllers/UserController'

const routes = Router()

routes.get('/users', new UserController().get)
routes.post('/users', new UserController().post)

export default routes
