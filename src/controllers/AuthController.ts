import { Request, Response, NextFunction } from 'express'
import passport from '../passport'

const unauthErrorResp = (res: Response): Response => {
  return res.status(401).json({ status: 'error', code: 'unauthorized' })
}

export default class AuthController {
  public static login (req: Request, res: Response): void {
    passport.authenticate('local', { session: false }, async (err, user) => {
      if (err || !user) {
        return unauthErrorResp(res)
      }

      return res.json(user)
    })(req, res)
  }

  public static authJWT (req: Request, res: Response, next: NextFunction): void {
    passport.authenticate('jwt', { session: false }, function (err, user) {
      if (err || !user) {
        return unauthErrorResp(res)
      }
      req.user = user
      next()
    })(req, res, next)
  }
}
