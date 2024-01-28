// require("dotenv").config({ path: "./env" });
import dotenv from "dotenv";
import { connectDB } from "./db/index.js";
dotenv.config({
  path: "./env",
});
connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log("Server is running ");
    });
  })
  .catch(() => {
    console.log("Mongo Db connection failed");
  });
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
