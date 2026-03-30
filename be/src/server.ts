import express, { Application } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { db } from "./config/db";

dotenv.config();
const app: Application = express();
const PORT: number = parseInt(process.env.PORT || "3000", 10);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    exposedHeaders: ["Authorization"],
  }),
);

const startServer = async () => {
  try {
    await db.query("SELECT 1");
    console.log("MySQL connection successful");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT} `);
    });
  } catch (error) {
    console.error("MySQL connection failed: ", error);
  }
};

startServer();
