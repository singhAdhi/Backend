// require("dotenv").config({ path: "./env" });
import dotenv from "dotenv";
import { connectDB } from "./db/index.js";
dotenv.config({
  path: "./env",
});
connectDB();

// (async () => {
//   try {
//     await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
//     app.listen(process.env.PORT, () => {
//       console.log(`port is listening on${process.env.PORT}`);
//     });
//   } catch (error) {
//     console.log(error);
//   }
// })();
