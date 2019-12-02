
import { Request, Response } from 'express'
import Tool, { ToolType } from '../schemas/Tool'
import { stringLiteral } from '@babel/types'

class ToolDTO {
    id: string;
    title: string;
    description: string ;
    tags: string[];

    constructor (id: string, title: string, description: string, tags: string[]) {
      this.id = id
      this.title = title
      this.description = description
      this.tags = tags
    }
}

class ToolController {
  public async create (req: Request, res: Response): Promise<void> {
    try {
      const tool = req.body

      if (tool.title && await Tool.find({ title: tool.title })) {
        res.status(400).json({ error: 'Title already exists' })
        return
      }

      const saved = await Tool.create(tool)

      res.status(201).json(this.schemaToDTO(saved))
    } catch (err) {
      if (err.name === 'ValidationError') {
        res.status(500).json(err)
      } else {
        res.status(500).json()
      }
    }
  }

  public async get (req: Request, res: Response): Promise<void> {
    try {
      const tag = req.query.tag
      const q = req.query.q

      let tools = []
      if (tag) {
        tools = await Tool.find({ tags: tag })
      } else if (q) {
        tools = await Tool.find({ $text: { $search: q } })
      } else {
        tools = await Tool.find()
      }

      res.status(200).json(tools.map(this.schemaToDTO))
    } catch (err) {
      res.status(500).json()
    }
  }

  public async delete (req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id
      if (id) {
        await Tool.deleteOne({ _id: id })
      }
      res.status(204).json()
    } catch (err) {
      res.status(500).json()
    }
  }

  schemaToDTO (schema: ToolType): ToolDTO {
    return new ToolDTO(schema._id, schema.title, schema.description, schema.tags)
  }
}

export default ToolController
