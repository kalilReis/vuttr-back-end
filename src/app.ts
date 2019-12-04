import express, { Application, RequestHandler } from 'express'
import cors from 'cors'
import mongoose, { Mongoose } from 'mongoose'
import dotenv from 'dotenv'
import routes from './routes'
import { Server } from 'http'

dotenv.config()

class App {
    public express: Application
    private mongoose: Mongoose | null = null
    private server: Server | null = null

    constructor () {
      this.express = express()
      this.middlewares()
    }

    private middlewares (): void {
      this.express.use(express.json())
        .use(cors())
        .use(routes)
    }

    public async connectDB (uri: string): Promise<void> {
      this.mongoose = await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
      })
    }

    public listen (port: string): void {
      this.server = this.express.listen(port, function (err) {
        if (err) { console.log(err) }
      })
    }

    public use (...handlers: RequestHandler[]): void {
      this.express.use(handlers)
    }

    public async disconnect (): Promise<void> {
      if (this.mongoose) await this.mongoose.connection.close()
      if (this.server) this.server.close()
    }
}

export default App
