import mongoose from "mongoose";
import "dotenv/config";

const connectDatabase = () => {
  mongoose.set("strictQuery", false);
  mongoose
    .connect(`${process.env.MONGO_URI}`)
    .then((data) => {
      console.log(`Mongodb connected with server: ${data.connection.host}`);
    })
    .catch((err) => {
      console.log({ err });
    });
};

export default connectDatabase;
