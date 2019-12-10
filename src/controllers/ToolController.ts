import { Request, Response } from 'express'
import Tool, { ToolType, ToolDTO } from '../schemas/Tool'
import { handleError } from './utils'
import { ToolValidation } from '../schemas/validation'
import { UserType } from '../schemas/User'

const schemaToDTO = (tool: ToolType): ToolDTO => {
  return new ToolDTO(
    tool.id,
    tool.title,
    tool.description,
    tool.tags,
    tool.link
  )
}

class ToolController {
  public static async create (req: Request, res: Response): Promise<Response> {
    try {
      const tool = req.body
      const user = req.user as UserType

      if (tool && tool.title) {
        const dbTool = await Tool.findOne({
          title: tool.title,
          userId: user.id
        })
        if (dbTool) {
          return res
            .status(409)
            .json({ error: ToolValidation.titleAlreadyInUse })
        }
      }

      const saved = await Tool.create({ ...tool, userId: user.id })
      return res.status(201).json(schemaToDTO(saved))
    } catch (err) {
      return handleError(err, res)
    }
  }

  public static async get (req: Request, res: Response): Promise<Response> {
    try {
      const tag = req.query.tags_like
      const q = req.query.q
      const user = req.user as UserType

      let tools = []
      if (tag) {
        tools = await Tool.find({ tags: tag, userId: user.id })
      } else if (q) {
        tools = await Tool.find({ $text: { $search: q }, userId: user.id })
      } else {
        tools = await Tool.find({ userId: user.id })
      }

      return res.status(200).json(tools.map(schemaToDTO))
    } catch (err) {
      return res.status(500).json()
    }
  }

  public static async delete (req: Request, res: Response): Promise<Response> {
    try {
      const id = req.params.id
      const user = req.user as UserType

      if (id) {
        await Tool.deleteOne({ _id: id, userId: user.id })
      }

      return res.status(204).json()
    } catch (err) {
      return res.status(500).json()
    }
  }
}

export default ToolController
