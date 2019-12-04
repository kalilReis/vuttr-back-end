
import App from './app'
import routes from './routes'

const app = new App()

const run = async (): Promise<void> => {
  await app.connectDB(process.env.MONGODB_URI || '')
  console.log('Database Connected')

  const PORT = process.env.PORT || '3000'
  app.use(routes)
  app.listen(PORT)
  console.log('Server listening port ' + PORT)
}
run()
