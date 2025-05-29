import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import contactRoutes from "./routes/contact.routes";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// CORS configuration remove if ot work in site
const allowedOrigins = [
  "https://website-nmwr-git-main-anshbansal811s-projects.vercel.app",
  "https://website-nmwr-git-database-connect-anshbansal811s-projects.vercel.app",
  "https://website-nmwr-3oxs629cc-anshbansal811s-projects.vercel.app",
  "http://localhost:5173", // Keep local development working
  "https://*.vercel.app", // Allow all Vercel preview deployments
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
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
//app.use(cors());
app.use(express.json());

// Routes
app.use("/api/contact", contactRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
