
import App from './app'
import routes from './routes'

const app = new App({ dbURI: process.env.MONGODB_URI || '', port: process.env.PORT || '3000' })

app.use(routes)
app.start()
