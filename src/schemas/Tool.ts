import { Schema, model, Document } from 'mongoose'

export interface ToolType extends Document {
    title: string,
    link: string,
    description: string,
    tags: string[]
}

const ToolSchema = new Schema({
  title: String,
  link: String,
  description: String,
  tags: [String]
}, {
  timestamps: true
})

export default model<ToolType>('tools', ToolSchema)
