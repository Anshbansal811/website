import express from "express";
import { authenticate } from "../middleware/auth-middleware";
import {
  uploadProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller";
import { getAllExistingProductName } from "../controllers/all-existing-product-name";
import { validateProduct } from "../middleware/validation-middleware";
import { rateLimiter } from "../middleware/rate-limiter";

const router = express.Router();

// Apply rate limiting to all routes
router.use(rateLimiter);

// Public routes
router.get("/", getAllProducts);
router.get("/:id", getProductById);

// Protected routes
router.post("/upload", authenticate, validateProduct, uploadProduct);
router.put("/:id", authenticate, validateProduct, updateProduct);
router.delete("/:id", authenticate, deleteProduct);

// Product name routes
router.get("/existing/names", authenticate, getAllExistingProductName);

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
