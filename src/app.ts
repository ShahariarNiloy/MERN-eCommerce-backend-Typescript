import bodyParser from 'body-parser'
import express from 'express'
import fileUpload from 'express-fileupload'
import ErrorFunc from './middlewares/error'

import order from './routes/orderRoutes'
import product from './routes/productRoute'
import user from './routes/userRoutes'

const app = express()

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(fileUpload())

app.use('/api/v1', product)
app.use('/api/v1', user)
app.use('/api/v1', order)

app.use(ErrorFunc)

export default app
