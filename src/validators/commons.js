import { body } from "express-validator";

const email = [
  body("email").isEmail().withMessage("invalid email").normalizeEmail(),
];

const password = [
  body("password")
    .not()
    .isEmpty()
    .withMessage("password empty")
    .isAscii()
    .withMessage("invalid password")
    .isLength({ min: 5 })
    .withMessage("password must be at least 5 characters long"),
];

const commons = { email, password };

export default commons;
