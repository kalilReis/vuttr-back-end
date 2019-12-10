import { Schema, model, Document } from 'mongoose'
import bcrypt from 'bcryptjs'
import { UserValidation as msg } from '../schemas/validation'

export const hashValueOf = (value: string): string => {
  const SALT_FACTOR = 10
  return bcrypt.hashSync(value, SALT_FACTOR)
}

export interface UserType extends Document {
  id: string
  firstName: string
  lastName: string
  email: string
  password: string

  comparePassword(password: string): boolean
}

export class UserDTO {
  constructor (
    readonly id: string,
    readonly firstName: string,
    readonly lastName: string,
    readonly email: string,
    readonly token: string
  ) {
    this.id = id
    this.firstName = firstName
    this.lastName = lastName
    this.email = email
    this.token = token
  }
}

export function toDTO (u: UserType, token: string): UserDTO {
  return new UserDTO(u.id, u.firstName, u.lastName, u.email, token)
}

const UserSchema = new Schema<UserType>(
  {
    firstName: { type: String, required: [true, msg.firstNameIsRequired] },
    lastName: { type: String, required: [true, msg.lastNameIsRequired] },
    email: {
      type: String,
      unique: true,
      required: [true, msg.emailIsRequired]
    },
    password: { type: String, required: [true, msg.passwordIsRequired] }
  },
  {
    timestamps: true
  }
)

UserSchema.methods.comparePassword = function (password: string): boolean {
  return bcrypt.compareSync(password, this.password)
}

UserSchema.pre<UserType>('save', function (next) {
  this.password = hashValueOf(this.password)
  next()
})

export default model<UserType>('users', UserSchema)
