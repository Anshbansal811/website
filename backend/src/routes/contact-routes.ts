import express, { RequestHandler } from "express";
import { authenticate } from "../middleware/auth-middleware";
import {
  submitContactForm,
  getContactById,
  updateContact,
  deleteContact,
} from "../controllers/contact-controller";
import { getAllUsersHandler } from "../controllers/all-contacts";
import { validateContact } from "../middleware/validation-middleware";
import { rateLimiter } from "../middleware/rate-limiter";

const router = express.Router();

// Apply rate limiting to all routes
router.use(rateLimiter);

// Public routes
router.post("/submit", validateContact, submitContactForm as RequestHandler);

// Protected routes
router.get("/all", authenticate, getAllUsersHandler);
router.get("/:id", authenticate, getContactById);
router.put("/:id", authenticate, validateContact, updateContact);
router.delete("/:id", authenticate, deleteContact);

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
