import request from 'supertest'
import App from '../app'
import routes from '../routes'
import Tool from '../schemas/Tool'

/* eslint-disable no-undef */

const app = new App()
app.use(routes)
const server = app.listen(process.env.PORT || '3000')

const tool =
{
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
  let createdTool = {}
  beforeAll(async () => {
    await app.connectDB(process.env.MONGODB_URI || '')
    await Tool.deleteMany({})
  })

  afterAll(async () => {
    server.close()
  })

  it('should create a tool', async () => {
    const resp = await request(server)
      .post('/tools')
      .send(tool)
      .expect(201)

    expect(resp.body.id).not.toBeNull()
    expect({ ...resp.body, id: 0 }).toEqual(tool)
    createdTool = resp.body
  })

  it('should get the created tool', async () => {
    const resp = await request(server)
      .get('/tools')
      .expect(200)
    expect(resp.body[0]).toEqual(createdTool)
  })

  it('should get the created tool by tag', async () => {
    const resp = await request(server)
      .get('/tools?tags_like=' + tool.tags[0])
      .expect(200)
    expect(resp.body[0]).toEqual(createdTool)
  })
})
