import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import fileUpload from 'express-fileupload'
import ErrorFunc from './middlewares/error'

import order from './routes/orderRoutes'
import payment from './routes/paymentRoutes'
import product from './routes/productRoute'
import user from './routes/userRoutes'

const app = express()

app.use(cors())
app.use(express.json())
app.use(bodyParser.json({ limit: '10mb' }))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }))
app.use(
    fileUpload({
        limits: { fileSize: 10 * 1024 * 1024 }, // Set the maximum file size (10MB in this example)
    })
)

app.use('/api/v1', product)
app.use('/api/v1', user)
app.use('/api/v1', order)
app.use('/api/v1', payment)

app.use(ErrorFunc)

export default app
