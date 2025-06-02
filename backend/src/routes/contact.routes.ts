import express, { RequestHandler } from "express";
import { authenticate} from "../middleware/auth.middleware";
import { UserRole } from "../models/user.model";
import pool from "../config/db";
import { submitContactForm } from "../controllers/contact.controller";

const router = express.Router();

router.post("/submit", submitContactForm as RequestHandler);

router.get(
  "/all",
  authenticate,
  async (req, res) => {
    try {
      const result = await pool.query(
        "SELECT * FROM Users ORDER BY created_at DESC"
      );
      res.json(result.rows);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
);

export default router;

