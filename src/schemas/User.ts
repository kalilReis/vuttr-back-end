import { Schema, model, Document } from 'mongoose'
import bcrypt from 'bcrypt'
import { UserValidation as msg } from '../schemas/validation'

export const hashValueOf = (value: string): string => {
  const SALT_FACTOR = 10
  return bcrypt.hashSync(value, SALT_FACTOR)
}

export interface User extends Document {
   firstName: string,
   lastName: string,
   email: string,
   password: string

  comparePassword(password: string): boolean
}

const UserSchema = new Schema<User>({
  firstName: { type: String, required: [true, msg.firstNameIsRequired] },
  lastName: { type: String, required: [true, msg.lastNameIsRequired] },
  email: { type: String, unique: true, required: [true, msg.emailIsRequired] },
  password: { type: String, required: [true, msg.passwordIsRequired] }
}, {
  timestamps: true
})

UserSchema.methods.comparePassword = function (password: string): boolean {
  return bcrypt.compareSync(password, this.password)
}

UserSchema.pre<User>('save', function (next) {
  this.password = hashValueOf(this.password)
  next()
})

export default model<User>('users', UserSchema)
