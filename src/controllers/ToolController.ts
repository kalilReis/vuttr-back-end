
import { Request, Response } from 'express'
import Tool, { ToolType } from '../schemas/Tool'

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

const schemaToDTO = (schema: ToolType): ToolDTO => { return new ToolDTO(schema._id, schema.title, schema.description, schema.tags) }

class ToolController {
  public async create (req: Request, res: Response): Promise<void> {
    const saved = await Tool.create(req.body)
    res.json(schemaToDTO(saved))
  }

  public async get (req: Request, res: Response): Promise<void> {
    const tools = await Tool.find()
    res.json(tools.map(schemaToDTO))
  }
}

export default ToolController
