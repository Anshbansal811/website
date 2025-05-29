import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import contactRoutes from "./routes/contact.routes";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
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
