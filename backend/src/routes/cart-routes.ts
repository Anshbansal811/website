import express from "express";
import {
  addToCart,
  getCart,
  removeFromCart,
} from "../controllers/cart-controller";
import { authenticate } from "../middleware/auth-middleware";

const router = express.Router();

router.post("/add", authenticate, addToCart);
router.get("/", authenticate, getCart);
router.post("/remove", authenticate, removeFromCart);

export default router;
