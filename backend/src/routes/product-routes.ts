import express from "express";
import { authenticate } from "../middleware/auth-middleware";
import { uploadProduct } from "../controllers/product.controller";
import { getAllExistingProductName } from "../controllers/all-existing-product-name";

const router = express.Router();

// Product routes
router.post("/upload", authenticate, uploadProduct);

//Get all product existing
router.get("/existing",authenticate, getAllExistingProductName)

//Get all image
router.get("/all-image",)


export default router;
