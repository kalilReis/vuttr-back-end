import express, { Application } from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import routes from './routes'
dotenv.config()

class App {
    public express: Application

    constructor () {
      this.express = express()
      this.middlewares()
      this.database()
    }

    private middlewares (): void {
      this.express.use(express.json())
        .use(cors())
        .use(routes)
    }

    private async database (): Promise<void> {
      await mongoose.connect(process.env.MONGODB_URI || '', {
        useNewUrlParser: true,
        useUnifiedTopology: true
      })
      console.log('database connected...')
    }
}

export default App
