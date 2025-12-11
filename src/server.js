import app from "./app.js";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

dotenv.config();
connectDB()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`app is running on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("Something went wrong while starting", error);
  });
