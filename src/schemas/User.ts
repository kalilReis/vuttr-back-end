import { Schema, model, Document } from 'mongoose'

interface UserI extends Document {
  name: string,
  email: string,
  password: string
}

const UserSchema = new Schema({
  name: String,
  email: String,
  password: String

}, {
  timestamps: true
})

export default model<UserI>('users', UserSchema)
