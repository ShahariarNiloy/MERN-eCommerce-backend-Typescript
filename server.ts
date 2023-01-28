import 'dotenv/config'
import app from './app'
import connectDatabase from './config/database'

connectDatabase()

app.listen(process.env.PORT ?? 4000, () => {
    console.log(
        `Server is working on http://localhost:${process.env.PORT ?? 4000}`
    )
})
