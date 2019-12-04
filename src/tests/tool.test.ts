
/* eslint-disable no-undef */
import request from 'supertest'

import App from '../app'
import routes from '../routes'
import Tool, { ToolType } from '../schemas/Tool'
import { ToolErrorMsgs } from '../schemas/validation'

const tool = {
  id: 0,
  title: 'Notion',
  link: 'https://notion.so',
  description: 'All in one tool to organize teams and ideas. Write, plan, collaborate, and get organized. ',
  tags: [
    'organization',
    'planning',
    'collaboration',
    'writing',
    'calendar'
  ]
}

describe('e2e /tools', function () {
  const app: App = new App()
  let createdTool: ToolType | null = null

  beforeAll(async () => {
    await app.connectDB(process.env.MONGODB_URI || '')
    await Tool.deleteMany({})

    app.listen(process.env.PORT || '3000')
    app.use(routes)
  })

  afterAll(async () => {
    await app.disconnect()
  })

  it('Should create a tool with id', async () => {
    const { body } = await request(app.express).post('/tools').send(tool).expect(201)
    createdTool = body
    expect(body.id).not.toBeNull()
    expect(body.id.trim()).not.toBe('')
    expect({ ...body, id: 0 }).toEqual(tool)
  })

  it('Should fail when try to create a tool with an existent tittle', async () => {
    await request(app.express).post('/tools').send(tool).expect(409)
  })

  it('Should fail when try to create an empty tool', async () => {
    const emptyTool = {}
    const { body } = await request(app.express).post('/tools').send(emptyTool).expect(400)
    expect(body.errors.title.message).toBe(ToolErrorMsgs.titleRequired)
    expect(body.errors.link.message).toBe(ToolErrorMsgs.linkRequired)
    expect(body.errors.description.message).toBe(ToolErrorMsgs.descriptionRequired)
  })

  it('Should get the created tool by tag', async () => {
    // eslint-disable-next-line @typescript-eslint/camelcase
    const { body } = await request(app.express).get('/tools').query({ tags_like: tool.tags[0] })
    expect(body[0]).toEqual(createdTool)
  })

  it('Should retrieve an empty array for an unknow tag', async () => {
    const randomTag = Math.random().toString(36).substring(7)
    // eslint-disable-next-line @typescript-eslint/camelcase
    const { body } = await request(app.express).get('/tools').query({ tags_like: randomTag })
    expect(body).toEqual([])
  })

  it('Should retrieve the created tool for a textual search', async () => {
    const { body } = await request(app.express).get('/tools').query({ q: tool.description.substring(0, 10) })
    expect(body[0]).toEqual(createdTool)
  })

  it('Should retrieve an empty array for an unknow textual query', async () => {
    const unknowQuery = Math.random().toString(36).substring(7)
    const { body } = await request(app.express).get('/tools').query({ q: unknowQuery })
    expect(body).toEqual([])
  })

  it('Should delete the tool by id', async () => {
    if (createdTool && createdTool.id) {
      await request(app.express).delete('/tools/' + createdTool.id).expect(204)
    } else {
      throw Error('created tool undefined')
    }
  })
})
