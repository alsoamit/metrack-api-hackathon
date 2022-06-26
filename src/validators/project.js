import { body } from "express-validator";

const projectSchema = [
  body("title")
    .not()
    .isEmpty()
    .withMessage("title can't be empty")
    .isLength({ min: 1, max: 100 })
    .withMessage("title is too long"),
  body("courseId").not().isEmpty().withMessage("invalid course"),
  body("description")
    .not()
    .isEmpty()
    .withMessage("description empty")
    .isLength({ min: 1, max: 1000 })
    .withMessage("description is too long"),
];

const feedback = [
  body("message")
    .not()
    .isEmpty()
    .withMessage("empty reply")
    .isLength({ min: 1, max: 300 })
    .withMessage("feedback is too long"),
  body("id").not().isEmpty().withMessage("invalid project"),
];

const project = { projectSchema, feedback };

export default project;
