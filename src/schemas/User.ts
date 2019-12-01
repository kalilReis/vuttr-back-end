import { Schema, model, Document } from 'mongoose'

interface User extends Document {
  firstName: string,
  lastName: string,
  email: string,
  password: string
}

const UserSchema = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String
}, {
  timestamps: true
})

export default model<User>('users', UserSchema)
