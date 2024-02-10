import { env } from 'process'
import { app } from './app'
import 'dotenv/config'

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log(`Server is running at port ${env.PORT}`)
  })
