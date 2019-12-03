import express, { Application, RequestHandler } from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import routes from './routes'
import { Server } from 'http'
dotenv.config()

class App {
    public express: Application

    constructor () {
      this.express = express()
      this.middlewares()
    }

    private middlewares (): void {
      this.express.use(express.json())
        .use(cors())
        .use(routes)
    }

    public connectDB (url: string): void {
      mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
      }).then(() => {
        console.log('database connected')
      }).catch((err) => {
        console.log(err)
      })
    }

    public use (...handlers: RequestHandler[]): void {
      this.express.use(handlers)
    }

    public listen (port: string): Server {
      return this.express.listen(port, (error) => {
        if (error) { console.log(error) } else { console.log(`Server listening on port ${port}`) }
      })
    }
}

export default App
