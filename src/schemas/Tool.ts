import { Schema, model, Document } from 'mongoose'
import { ToolValidation as valid } from './validation'

export interface ToolType extends Document {
  readonly title: string
  readonly link: string
  readonly description: string
  readonly tags: string[]
  readonly userId: string
}

export class ToolDTO {
  constructor (
    readonly id: string,
    readonly title: string,
    readonly description: string,
    readonly tags: string[],
    readonly link: string
  ) {
    this.id = id
    this.title = title
    this.description = description
    this.tags = tags
    this.link = link
  }
}

const ToolSchema = new Schema(
  {
    title: { type: String, required: [true, valid.titleRequired] },
    link: { type: String, required: [true, valid.linkRequired] },
    description: {
      type: String,
      maxlength: [
        valid.descriptionLimitExceeded.max,
        valid.descriptionLimitExceeded.msg
      ],
      required: [true, valid.descriptionRequired]
    },
    tags: { type: [String], required: [true, valid.tagsRequired] },
    userId: { type: String, required: true }
  },
  {
    timestamps: true
  }
)

ToolSchema.index({ title: 1, userId: 1 }, { unique: true })
ToolSchema.index({ '$**': 'text' })

export default model<ToolType>('tools', ToolSchema)
