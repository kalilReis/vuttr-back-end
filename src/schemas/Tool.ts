import { Schema, model, Document } from 'mongoose'
import { ToolValidation as validation } from './validation'

export interface ToolType extends Document {
  readonly title: string,
  readonly link: string,
  readonly description: string,
  readonly tags: string[]
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
