import app from './app';
require("dotenv").config();
import connectDatabase from "./config/database";


connectDatabase();

app.listen(process.env.PORT || 4000, ()=>{
  console.log(`Server is working on http://localhost:${process.env.PORT}`);
})
