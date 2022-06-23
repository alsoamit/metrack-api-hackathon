import { Router } from "express";
import adminController from "../controllers/adminController";
import authController from "../controllers/auth-controller";
import courseController from "../controllers/course-controller";
import messageController from "../controllers/messageController";
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

router.delete(
  "/api/admin/delete-user/:id",
  authenticate,
  verifyAdmin,
  adminController.deleteUser
);

// MESSAGES
router.get("/api/messages", messageController.getMessages);
router.post("/api/messages", authenticate, messageController.addMessage);

// TEMPALTE AUTH
router.post("/api/register", authController.registerUser);
router.post("/api/login", authController.loginUser);

// COURSES (ADMIN)
router.post(
  "/api/admin/add-courses",
  authenticate,
  verifyAdmin,
  courseController.addCourse
);
router.delete(
  "/api/admin/delete-course/:id",
  authenticate,
  verifyAdmin,
  courseController.deleteCourse
);
router.post(
  "/api/admin/edit-courses",
  authenticate,
  verifyAdmin,
  courseController.editCourse
);
router.get(
  "/api/admin/get-all-course",
  authenticate,
  verifyAdmin,
  courseController.getAllCourses
);
router.get(
  "/api/admin/get-course/:id",
  authenticate,
  verifyAdmin,
  courseController.getCourseById
);
router.put(
  "/api/admin/publish-course/:id",
  authenticate,
  verifyAdmin,
  courseController.publishCourse
);
router.put(
  "/api/admin/unpublish-course/:id",
  authenticate,
  verifyAdmin,
  courseController.unPublishCourse
);

// COURSES (USER)
router.get("/api/get-all-course", courseController.getPublishedCourses);
router.get("/api/get-course/:id", courseController.getCourseById);

export default router;
