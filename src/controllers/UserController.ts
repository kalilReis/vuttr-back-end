import { Request, Response } from 'express'
import User from '../schemas/User'
import { handleError } from './utils'
import { UserValidation } from '../schemas/validation'

class UserController {
  public static async create (req: Request, res: Response): Promise<Response> {
    try {
      const password = req.body.password
      const confirmationPassword = req.body.confirmationPassword

      if (password !== confirmationPassword) {
        return res
          .status(400)
          .json({ erros: { password: UserValidation.passwordMustBeEqual } })
      }

      if (req.body.email) {
        const userDb = await User.findOne({ email: req.body.email })
        if (userDb) {
          return res.status(409).json({
            errors: {
              email: {
                path: 'email',
                message: UserValidation.emailAlreadyInUse
              }
            }
          })
        }
      }

      const saved = await User.create(req.body)
      return res.status(201).json({ id: saved.id })
    } catch (err) {
      return handleError(err, res)
    }
  }
}
export default UserController
