import 'dotenv/config'
import mongoose from 'mongoose'

const connectDatabase = (): void => {
    mongoose.set('strictQuery', false)
    mongoose
        .connect(`${process.env.MONGO_URI ?? 'No URI specified'}`)
        .then((data) => {
            console.log(
                `Mongodb connected with server: ${data.connection.host}`
            )
        })
        .catch((err) => {
            console.log(err)
        })
}

export default connectDatabase
