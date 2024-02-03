// import mongoose from "mongoose";
// import { DB_NAME } from "../constants.js";
// import express from "express";
// const app = express();
// let connectDB = async () => {
//   try {
//     await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
//     console.log("mongo db connect");
//     app.listen(process.env.PORT, () => {
//       console.log(`port is listening on${process.env.PORT}`);
//     });
//   } catch (error) {
//     console.log(`MONGO DB CONNECTION ERROR ${error}`);
//   }
// };
// //connection to the database
// export { connectDB };.
import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    console.log(
      `\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("MONGODB connection FAILED ", error);
    process.exit(1);
  }
};

export default connectDB;
