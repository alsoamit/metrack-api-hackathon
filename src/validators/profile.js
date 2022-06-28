import { body } from "express-validator";

const update = [
  body("hashnode")
    .isLength({ min: 0, max: 30 })
    .withMessage("hashnode username is too long"),
  body("github")
    .isLength({ min: 0, max: 30 })
    .withMessage("github username is too long"),
  body("linkedin")
    .isLength({ min: 0, max: 30 })
    .withMessage("linkedin username is too long"),
  body("about")
    .isLength({ min: 0, max: 2000 })
    .withMessage("about description is too long"),
];

const profile = { update };

export default profile;
