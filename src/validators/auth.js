import { body } from "express-validator";

const register = [
  body("email").isEmail().withMessage("invalid email").normalizeEmail(),
  body("name")
    .not()
    .isEmpty()
    .withMessage("name can't be empty")
    .isAscii()
    .withMessage("invalid characters in name"),
  body("password")
    .not()
    .isEmpty()
    .withMessage("password empty")
    .isAscii()
    .withMessage("invalid password")
    .isLength({ min: 5 })
    .withMessage("password must be at least 5 characters long"),
];

const login = [
  body("email").isEmail().withMessage("invalid email").normalizeEmail(),
  body("password")
    .not()
    .isEmpty()
    .withMessage("password empty")
    .isAscii()
    .withMessage("invalid password")
    .isLength({ min: 5 })
    .withMessage("password must be at least 5 characters long"),
];

const updatePassword = [
  body("oldPassword")
    .not()
    .isEmpty()
    .withMessage("password empty")
    .isAscii()
    .withMessage("invalid password")
    .isLength({ min: 5 })
    .withMessage("password must be at least 5 characters long"),
  body("newPassword")
    .not()
    .isEmpty()
    .withMessage("password empty")
    .isAscii()
    .withMessage("invalid password")
    .isLength({ min: 5 })
    .withMessage("password must be at least 5 characters long"),
];

const auth = { register, login, updatePassword };

export default auth;
