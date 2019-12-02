
import { Request, Response } from 'express'
import Tool, { ToolType } from '../schemas/Tool'

class ToolDTO {
    id: string;
    link: string;
    title: string;
    description: string ;
    tags: string[];

    constructor (id: string, title: string, description: string, tags: string[], link: string) {
      this.id = id
      this.title = title
      this.description = description
      this.tags = tags
      this.link = link
    }
}

const schemaToDTO = (schema: ToolType): ToolDTO => {
  return new ToolDTO(schema.id, schema.title, schema.description, schema.tags, schema.link)
}

class ToolController {
  public async create (req: Request, res: Response): Promise<void> {
    try {
      const tool = req.body

      if (tool.title) {
        const dbTool = await Tool.findOne({ title: tool.title })
        if (dbTool) {
          res.status(400).json({ error: 'Title already exists' })
        }
      }

      const saved = await Tool.create(tool)

      res.status(201).json(schemaToDTO(saved))
    } catch (err) {
      console.log(err)
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

      res.status(200).json(tools.map(schemaToDTO))
    } catch (err) {
      res.status(500).json(err)
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
}

export default ToolController
