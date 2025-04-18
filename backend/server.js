import express from "express";
import authRoutes from "./routes/auth.routes.js";
import dotenv from "dotenv";
import connectDB from "./db/connectMongo.js";

const app = express();

dotenv.config();
const PORT = process.env.PORT || 3000;

app.use("/api/auth", authRoutes);
console.log(process.env.MONGO_URI);

app.listen(PORT, () => {
  console.log("localhost started at host http://localhost:"+ PORT);
  connectDB();
});
