import express, { Application, RequestHandler } from 'express'
import cors from 'cors'
import mongoose, { Mongoose } from 'mongoose'
import routes from './routes'
import { Server } from 'http'

class App {
    readonly express: Application = express()
    private mongoose: Mongoose | null = null
    private server: Server | null = null
    private dbURI: string
    private port: string

    constructor ({ dbURI, port }:{ dbURI: string, port: string }) {
      if (!dbURI) {
        throw Error('No mongo connection string. Set MONGODB_URI environment variable')
      }

      if (!port) {
        throw Error('No server port defined. set PORT environment variable')
      }

      this.configServer()
      this.dbURI = dbURI
      this.port = port
    }

    private configServer (): void {
      this.express.use(express.json())
        .use(cors())
        .use(routes)
    }

    public start (): void {
      const run = async () : Promise<void> => {
        await this.connectDB()
        this.listen()
      }
      run()
    }

    private async connectDB (): Promise<void> {
      this.mongoose = await mongoose.connect(this.dbURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
      })
      console.log('database connected...')
    }

    private listen (): void {
      this.server = this.express.listen(this.port, (err) => {
        if (err) { console.error(err) } else { console.log('server connected on port ' + this.port) }
      })
    }

    public use (...handlers: RequestHandler[]): void {
      this.express.use(handlers)
    }

    public async stop (): Promise<void> {
      if (this.mongoose) await this.mongoose.connection.close()
      if (this.server) this.server.close()
    }
}

export default App
