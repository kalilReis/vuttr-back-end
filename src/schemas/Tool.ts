import { Schema, model, Document } from 'mongoose'

export interface ToolType extends Document {
    title: string,
    link: string,
    description: string,
    tags: string[]
}

const ToolSchema = new Schema({
  title: { type: String, unique: true, required: [true, 'Title is required'] },
  link: { type: String, required: [true, 'Link is required'] },
  description: { type: String, required: [true, 'description is required'] },
  tags: { type: [String], required: [true, 'Tags is required'] }
}, {
  timestamps: true
})

ToolSchema.index({ '$**': 'text' })

export default model<ToolType>('tools', ToolSchema)
