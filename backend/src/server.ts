import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import contactRoutes from "./routes/contact-routes";
import authRoutes from "./routes/auth-routes";
import productRoutes from "./routes/product-routes";
import pool from "./config/db";
import path from "path";
import { errorHandler } from "./middleware/error-handler";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

// Test database connection with retry logic
const connectWithRetry = async (retries = 5, delay = 5000) => {
  for (let i = 0; i < retries; i++) {
    try {
      await pool.connect();
      console.log("PostgreSQL Database connected successfully");
      return;
    } catch (err) {
      console.error(`Database connection attempt ${i + 1} failed:`, err);
      if (i < retries - 1) {
        console.log(`Retrying in ${delay / 1000} seconds...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }
  throw new Error("Failed to connect to database after multiple attempts");
};

connectWithRetry().catch((err) => {
  console.error("Fatal: Could not connect to database:", err);
  process.exit(1);
});

// CORS configuration
const allowedOrigins = [
  //"https://frontend1-t6n0.onrender.com",
  "http://localhost:5173", // Keep local development working
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
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
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Serve uploaded files with caching
app.use(
  "/uploads",
  express.static(path.join(__dirname, "../uploads"), {
    maxAge: "1d",
    etag: true,
  })
);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy" });
});

// Routes
app.use("/api/contact", contactRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

// Error middleware comes last
app.use(errorHandler);

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Closing HTTP server...");
  pool.end(() => {
    console.log("Database pool closed");
    process.exit(0);
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
