import express, { Application } from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";
import userRoutes from "./routes/user.routes";
import postRoutes from "./routes/post.routes";

dotenv.config();

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(cookieParser());    
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
  }));
  

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/posts", postRoutes);

connectDB();

export default app;
