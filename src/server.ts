
import App from './app'
import dotenv from 'dotenv'
dotenv.config()

const app = new App()
const port = process.env.PORT || '3000'
app.express.listen(port, (error) => {
  if (error) { console.log(error) } else { console.log(`Server listening on port ${port}`) }
})
