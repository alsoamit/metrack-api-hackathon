import { Router } from "express";
import authController from "../controllers/auth-controller";
import authenticate from "../middleware/auth-middleware";

const router = Router();

// AUTH
router.get("/api/refresh", authController.refresh);
router.post("/api/logout", authenticate, authController.logout);

// TEMPALTE AUTH
router.post("/api/register", authController.registerUser);
router.post("/api/login", authController.loginUser);

export default router;
