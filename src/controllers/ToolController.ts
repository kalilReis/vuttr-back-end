
import { Request, Response } from 'express'
import Tool, { ToolType } from '../schemas/Tool'
import { handleError } from './utils'
import { ToolValidation } from '../schemas/validation'

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
  public static async create (req: Request, res: Response): Promise<Response> {
    try {
      const tool = req.body

      if (tool && tool.title) {
        const dbTool = await Tool.findOne({ title: tool.title })
        if (dbTool) {
          return res.status(409).json({ error: ToolValidation.titleAlreadyInUse })
        }
      }

      const saved = await Tool.create(tool)
      return res.status(201).json(schemaToDTO(saved))
    } catch (err) {
      return handleError(err, res)
    }
  }

  public static async get (req: Request, res: Response): Promise<Response> {
    try {
      const tag = req.query.tags_like
      const q = req.query.q

      let tools = []
      if (tag) {
        tools = await Tool.find({ tags: tag })
      } else if (q) {
        tools = await Tool.find({ $text: { $search: q } })
      } else {
        tools = await Tool.find()
      }

      return res.status(200).json(tools.map(schemaToDTO))
    } catch (err) {
      return res.status(500).json()
    }
  }

  public static async delete (req: Request, res: Response): Promise<Response> {
    try {
      const id = req.params.id
      if (id) {
        await Tool.deleteOne({ _id: id })
      }
      return res.status(204).json()
    } catch (err) {
      return res.status(500).json()
    }
  }
}

export default ToolController
