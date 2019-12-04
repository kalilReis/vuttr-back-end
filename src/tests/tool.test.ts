
/* eslint-disable no-undef */
import request from 'supertest'

import App from '../app'
import routes from '../routes'

describe('e2e /tools', function () {
  const app: App = new App()
  beforeAll(async () => {
    await app.connectDB(process.env.MONGODB_URI || '')
    app.listen(process.env.PORT || '3000')
    app.use(routes)
  })

  afterAll(async () => {
    await app.disconnect()
  })

  it('GET tools', async () => {
    await request(app.express).get('/tools').expect(200)
  })
})
