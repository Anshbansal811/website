import express from "express";
import {
  signup,
  login,
  getMe,
  refreshToken,
  logout,
  forgotPassword,
  resetPassword,
  updateProfile,
} from "../controllers/auth-controller";
import { authenticate } from "../middleware/auth-middleware";
import { validateAuth } from "../middleware/validation-middleware";
import { rateLimiter } from "../middleware/rate-limiter";

const router = express.Router();

// Apply rate limiting to all routes
router.use(rateLimiter);

// Public routes
router.post("/signup", validateAuth, signup);
router.post("/login", validateAuth, login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/refresh-token", refreshToken);

// Protected routes
router.get("/me", authenticate, getMe);
router.post("/logout", authenticate, logout);
router.put("/profile", authenticate, validateAuth, updateProfile);

// Error handling middleware
router.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
);

export default router;
