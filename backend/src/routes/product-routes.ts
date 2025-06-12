import express from "express";
import multer from "multer";

import { authenticate } from "../middleware/auth-middleware";
import { uploadProduct } from "../controllers/product.controller";

const router = express.Router();

// Product routes
router.post("/upload", authenticate, uploadProduct);

export default router;
