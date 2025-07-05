import express from "express";
import { buyProduct, getPurchases } from "../controllers/purchase-controller";
import { authenticate } from "../middleware/auth-middleware";

const router = express.Router();

router.post("/buy", authenticate, buyProduct);
router.get("/", authenticate, getPurchases);

export default router;
