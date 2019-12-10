import passport from 'passport'
import passportLocal from 'passport-local'
import passportJWT from 'passport-jwt'
import User, { toDTO } from './schemas/User'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const LocalStrategy = passportLocal.Strategy
const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt

const secret = (): string => {
  if (!process.env.JWT_SECRET) throw Error('JWT_SECRET environment not found!')
  return process.env.JWT_SECRET
}

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    async function (email: string, password: string, cb) {
      try {
        const user = await User.findOne({ email })
        if (!user || !user.comparePassword(password)) {
          return cb(null, false)
        } else {
          const token = jwt.sign({ id: user.id }, secret(), { expiresIn: '1h' })
          return cb(null, toDTO(user, 'Bearer ' + token))
        }
      } catch (error) {
        return cb(error, false)
      }
    }
  )
)

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret()
    },
    async function (jwtPayload, cb) {
      try {
        const user = await User.findById(jwtPayload.id)
        if (user) {
          return cb(null, user)
        }
        return cb(null, null)
      } catch (error) {
        return cb(error)
      }
    }
  )
)

export default passport
