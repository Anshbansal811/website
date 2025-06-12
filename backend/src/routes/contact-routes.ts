import express, { RequestHandler } from "express";
import { authenticate } from "../middleware/auth-middleware";
import { submitContactForm } from "../controllers/contact-controller";
import { getAllUsersHandler } from "../controllers/all-contacts";

const router = express.Router();

router.post("/submit", submitContactForm as RequestHandler);

router.get("/all", authenticate, getAllUsersHandler);

export default router;
