import express from "express";
import { signup, login } from "../controllers/auth-controller";

const router = express.Router();

// Public routes
router.post("/signup", signup);
router.post("/login", login);

export default router;
