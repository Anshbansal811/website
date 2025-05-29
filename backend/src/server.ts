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
  "http://localhost:5173", // Keep local development working
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
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
