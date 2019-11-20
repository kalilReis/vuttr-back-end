import { Request, Response } from 'express'
import User from '../schemas/User'

class UserController {
  public async get (req: Request, res: Response): Promise<Response> {
    const users = await User.find()
    return res.json(users)
  }

  public async post (req: Request, res: Response): Promise<Response> {
    await User.create(req.body)
    return res.status(201).send()
  }
}
export default UserController
