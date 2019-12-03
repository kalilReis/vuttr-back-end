
import App from './app'
import routes from './routes'

const app = new App()

const MONGODB_URI = process.env.MONGODB_URI || ''
app.connectDB(MONGODB_URI)

const PORT = process.env.PORT || '3000'
app.use(routes)
app.listen(PORT)
