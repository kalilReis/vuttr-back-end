import { Schema, model, Document } from 'mongoose'
import { ToolValidation as valid } from './validation'

export interface ToolType extends Document {
  readonly title: string,
  readonly link: string,
  readonly description: string,
  readonly tags: string[]
}

const ToolSchema = new Schema({
  title: { type: String, unique: true, required: [true, valid.titleRequired] },
  link: { type: String, required: [true, valid.linkRequired] },
  description: {
    type: String,
    maxlength: [valid.descriptionLimitExceeded.max, valid.descriptionLimitExceeded.msg],
    required: [true, valid.descriptionRequired]
  },
  tags: { type: [String], required: [true, valid.tagsRequired] }
}, {
  timestamps: true
})

ToolSchema.index({ '$**': 'text' })

export default model<ToolType>('tools', ToolSchema)
