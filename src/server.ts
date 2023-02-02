import 'dotenv/config'
import app from './app'
import connectDatabase from './config/database'

process.on('uncaughtException', () => {
    process.exit(1)
})

connectDatabase()

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
