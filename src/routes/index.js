import { Router } from "express";
import adminController from "../controllers/adminController";
import authController from "../controllers/auth-controller";
import channelController from "../controllers/channel-controller";
import courseController from "../controllers/course-controller";
import discussionsController from "../controllers/discussionsController";
import messageController from "../controllers/messageController";
import projectController from "../controllers/projectController";
import verifyEmailController from "../controllers/verify-email-controller";
import verifyAdmin from "../middleware/admin-middleware";
import authenticate from "../middleware/auth-middleware";

const router = Router();

// AUTH
router.post("/api/register", authController.registerUser);
router.post("/api/login", authController.loginUser);
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

// DISCUSSIONS
router.get(
  "/api/discussions/:id",
  authenticate,
  discussionsController.getDiscussionById
);

// MESSAGES
router.post("/api/messages", authenticate, messageController.addMessage);
router.post("/api/reply/", authenticate, messageController.addReply);

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
router.get(
  "/api/enroll-course/:id",
  authenticate,
  courseController.enrollCourse
);
router.get(
  "/api/get-enroll-course",
  authenticate,
  courseController.enrollCourse
);

// PROJECTS
router.post("/api/projects", authenticate, projectController.addProject);
router.get("/api/projects", authenticate, projectController.getProjects);
router.post("/api/addFeedback", authenticate, projectController.addFeedback);

// CHANNELS (ADMIN)
router.post(
  "/api/admin/add-channel",
  authenticate,
  verifyAdmin,
  channelController.addChannel
);
router.get(
  "/api/admin/get-channel/:id",
  authenticate,
  verifyAdmin,
  channelController.getChannelById
);
router.get(
  "/api/admin/get-all-channel",
  authenticate,
  verifyAdmin,
  channelController.getAllChannels
);

export default router;
