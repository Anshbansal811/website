import { Router, RequestHandler } from "express";
import { submitContactForm } from "../controllers/contact.controller";

const router = Router();

router.post("/submit", submitContactForm as RequestHandler);

export default router;
