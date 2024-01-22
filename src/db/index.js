import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import express from "express";
const app = express();
export let connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
    console.log("mongo db connect");
    app.listen(process.env.PORT, () => {
      console.log(`port is listening on${process.env.PORT}`);
    });
  } catch (error) {
    console.log(`MONGO DB CONNECTION ERROR ${error}`);
  }
};
