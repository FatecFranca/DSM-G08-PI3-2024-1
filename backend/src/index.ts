import mongoose from 'mongoose'
import { env } from './configs/env'

import server from './configs/server'

mongoose.connect(env.DATABASE_URL)
  .then(() => {
    server.listen(env.PORT, () => console.log(`Server runing at: http://localhost:${env.PORT}`))
  })
  .catch(err => {
    console.log('Error connecting to the database: ', err)
  })