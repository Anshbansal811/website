import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import contactRoutes from "./routes/contact-routes";
import authRoutes from "./routes/auth-routes";
import pool from "./config/db";
import "./config/mongodb";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Test database connection
pool
  .connect()
  .then(() => {
    console.log("PostgreSQL Database connected successfully");
  })
  .catch((err) => {
    console.error("PostgreSQL Database connection error:", err);
  });

// CORS configuration
const allowedOrigins = [
  //"https://frontend1-t6n0.onrender.com",
  "http://localhost:5173", // Keep local development working
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.log("Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middleware
app.use(express.json());

// Routes
app.use("/api/contact", contactRoutes); // postgreSQL
app.use("/api/auth", authRoutes); // MongoDB

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
