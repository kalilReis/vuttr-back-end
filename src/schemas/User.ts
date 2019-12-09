import { Schema, model, Document } from 'mongoose'
import bcrypt from 'bcrypt'

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
  firstName: { type: String, required: [true, 'first name is required'] },
  lastName: { type: String, required: [true, 'last name is required'] },
  email: { type: String, unique: true, required: [true, 'email is required'] },
  password: { type: String, required: [true, 'password is required'] }
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
