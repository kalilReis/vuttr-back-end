import { Request, Response } from 'express'
import User from '../schemas/User'

import { UserValidation } from '../schemas/validation'

class UserController {
  public static async create (req: Request, res: Response): Promise<Response> {
    const password = req.body.password
    const confirmationPassword = req.body.confirmationPassword

    try {
      if (password !== confirmationPassword) {
        return res.status(400).json({
          errors: {
            password: {
              path: 'password',
              message: UserValidation.passwordMustBeEqual
            },
            confirmationPassword: {
              path: 'confirmationPassword',
              message: UserValidation.passwordMustBeEqual
            }
          }
        })
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
      if (err.name === 'ValidationError') {
        if (confirmationPassword.trim() === '') {
          err.errors.confirmationPassword = {
            path: 'confirmationPassword',
            message: UserValidation.confirmationPassword
          }
        }
        return res.status(400).json(err)
      } else {
        return res.status(500).json()
      }
    }
  }
}
export default UserController
