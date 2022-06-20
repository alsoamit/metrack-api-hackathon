import { Router } from "express";
import authController from "../controllers/auth-controller";
import courseController from "../controllers/course-controller";
import verifyEmailController from "../controllers/verify-email-controller";
import APIResponse from "../helpers/APIResponse";
import verifyAdmin from "../middleware/admin-middleware";
import authenticate from "../middleware/auth-middleware";

const router = Router();

// AUTH
router.get("/api/refresh", authController.refresh);
router.post("/api/logout", authenticate, authController.logout);
router.post("/api/request-password-reset", authController.requestPasswordReset);
router.post("/api/reset-password", authController.resetPassword);
router.post("/api/validate-magictoken", authController.magicTokenValidation);
router.get("/api/verify-email", authenticate, verifyEmailController.sendLink);
router.post("/api/verify-email", verifyEmailController.verify);

// only for testing
router.get("/api/admin", authenticate, verifyAdmin, (req, res) => {
    return APIResponse.successResponse(res)
        ;
});

// TEMPALTE AUTH
router.post("/api/register", authController.registerUser);
router.post("/api/login", authController.loginUser);

// COURSES (ADMIN)
router.post('/api/add-course', courseController.addCourse)
router.post('/api/delete-course', courseController.deleteCourse)

export default router;
