
import App from './app'
import routes from './routes'

const app = new App()
app.express.use(routes)

const port = process.env.PORT || '3000'
app.express.listen(port, (error) => {
  if (error) { console.log(error) } else { console.log(`Server listening on port ${port}`) }
})
