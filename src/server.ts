
import App from './app'
import routes from './routes'

const app = new App()

const start = async (): Promise<void> => {
  await app.connectDB(process.env.MONGODB_URI || '')
  app.use(routes)
  app.listen(process.env.PORT || '3000')
}

start()
