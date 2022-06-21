import { Router } from "express";
import adminController from "../controllers/adminController";
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

// ADMIN AUTH
router.post("/api/admin/login", authController.adminLogin);
router.post("/api/admin/logout", authController.logout);

// ADMIN ROUTES
router.post(
  "/api/admin/get-users",
  authenticate,
  verifyAdmin,
  adminController.getUsers
);

// only for testing
router.get("/api/admin", authenticate, verifyAdmin, (req, res) => {
  return APIResponse.successResponse(res);
});

// TEMPALTE AUTH
router.post("/api/register", authController.registerUser);
router.post("/api/login", authController.loginUser);

// COURSES (ADMIN)
router.post('/api/admin/add-courses', authenticate, verifyAdmin, courseController.addCourse)
router.post('/api/admin/delete-course', authenticate, verifyAdmin, courseController.deleteCourse)
router.get('/api/admin/get-all-course', authenticate, verifyAdmin, courseController.getAllCourses)
router.get('/api/admin/get-course/:id', authenticate, verifyAdmin, courseController.getCourseById)

export default router;
