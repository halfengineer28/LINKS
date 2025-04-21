import express from "express";
import authRoutes from "./routes/auth.routes.js";
import dotenv from "dotenv";
import connectDB from "./db/connectMongo.js";
import userRoutes from "./routes/user.routes.js";
import { v2 as cloudinary } from "cloudinary";

import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(cookieParser());

dotenv.config();
const PORT = process.env.PORT || 3000;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secrect: process.env.CLOUDINARY_API_SECRECT,
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
console.log(process.env.MONGO_URI);

app.listen(PORT, () => {
  console.log("localhost started at host http://localhost:" + PORT);
  connectDB();
});
