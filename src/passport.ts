import passport from 'passport'
import passportLocal from 'passport-local'
import passportJWT from 'passport-jwt'
import User from './schemas/User'
import jwt from 'jsonwebtoken'

const LocalStrategy = passportLocal.Strategy
const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt

const JWT_SECRET = 'WepggV74s8WKnxkFPs5'

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async function (email: string, password: string, cb) {
  try {
    const user = await User.findOne({ email })
    if (!user || !user.comparePassword(password)) {
      return cb(null, false)
    } else {
      const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' })
      return cb(null, 'Bearer ' + token)
    }
  } catch (error) {
    return cb(error, false)
  }
}))

passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET
}, async function (jwtPayload, cb) {
  try {
    const user = await User.findById(jwtPayload.id)
    if (user) {
      return cb(null, user)
    }
    return cb(null, null)
  } catch (error) {
    return cb(error)
  }
}))

export default passport
