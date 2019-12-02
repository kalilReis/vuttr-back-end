import { Schema, model, Document } from 'mongoose'
import { ToolErrorMsgs as validation } from './validation'

export interface ToolType extends Document {
    title: string,
    link: string,
    description: string,
    tags: string[]
}

const ToolSchema = new Schema({
  title: { type: String, unique: true, required: [true, validation.titleRequired] },
  link: { type: String, required: [true, validation.linkRequired] },
  description: {
    type: String,
    maxlength: [validation.descriptionLimitExceeded.max, validation.descriptionLimitExceeded.msg],
    required: [true, validation.descriptionRequired]
  },
  tags: { type: [String], required: [true, validation.tagsRequired] }
}, {
  timestamps: true
})

ToolSchema.index({ '$**': 'text' })

export default model<ToolType>('tools', ToolSchema)
