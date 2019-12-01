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
    }

    private middlewares (): void {
      this.express.use(express.json())
      this.express.use(cors())
      this.express.use(routes)
    }

    private database (): void {
      mongoose.connect(process.env.MONGODB_URI || '', {
        useNewUrlParser: true,
        useUnifiedTopology: true
      })
    }
}

export default App
