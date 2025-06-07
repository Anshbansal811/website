import express from "express";
import { signup, login, getMe } from "../controllers/auth-controller";
import { authenticate } from "../middleware/auth-middleware";

const router = express.Router();

// Public routes
router.post("/signup", signup);
router.post("/login", login);

// Protected routes
router.get("/me", authenticate, getMe);

export default router;
