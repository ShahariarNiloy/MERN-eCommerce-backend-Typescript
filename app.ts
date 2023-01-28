import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import express from 'express'
import fileUpload from 'express-fileupload'
import ErrorFunc from './middlewares/error'

import product from './routes/productRoute'

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(fileUpload())

app.use('/api/v1', product)

app.use(ErrorFunc)

export default app
