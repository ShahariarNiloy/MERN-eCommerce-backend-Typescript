import * as cloudinary from 'cloudinary'
import 'dotenv/config'
import app from './app'
import connectDatabase from './config/database'

process.on('uncaughtException', () => {
    process.exit(1)
})

connectDatabase()

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

const server = app.listen(process.env.PORT ?? 4000, () => {
    console.log(
        `Server is working on http://localhost:${process.env.PORT ?? 4000}`
    )
})

process.on('unhandledRejection', () => {
    server.close(() => {
        process.exit(1)
    })
})
