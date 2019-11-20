import express, { Application } from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

import routes from './routes'

class App {
    public express: Application

    constructor () {
      this.express = express()
      this.middlewares()
      this.database()
      this.routes()
    }

    private middlewares (): void {
      this.express.use(express.json())
      this.express.use(cors())
      this.express.use(routes)
    }

    private database (): void {
      mongoose.connect(process.env.MONGO_URI || '', {
        useNewUrlParser: true,
        useUnifiedTopology: true
      })
    }

    private routes (): void {
      this.express.get('/', (req, res) => {
        return res.send('Hello World')
      })
    }
}

export default App
