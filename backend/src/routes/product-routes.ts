/*import express from "express";
import multer from "multer";
import {
  uploadProduct,
  getProducts,
  getProductById,
  getExistingProducts,
} from "../controllers/product-controller";
import { authenticate } from "../middleware/auth-middleware";

const router = express.Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Product routes
router.post(
  "/upload",
  upload.fields([
    { name: "frontImage", maxCount: 1 },
    { name: "backImage", maxCount: 1 },
    { name: "leftImage", maxCount: 1 },
    { name: "rightImage", maxCount: 1 },
    { name: "topImage", maxCount: 1 },
    { name: "bottomImage", maxCount: 1 },
    { name: "detailImages", maxCount: 5 },
    { name: "otherImages", maxCount: 5 },
  ]) as any,
  authenticate,
  uploadProduct
);

router.get("/", getProducts);
router.get("/existing", getExistingProducts);
router.get("/:id", getProductById);

export default router;*/
