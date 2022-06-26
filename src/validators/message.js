import { body } from "express-validator";

const string = [
  body("message")
    .not()
    .isEmpty()
    .withMessage("empty message")
    .isLength({ min: 1, max: 600 })
    .withMessage("message is too long"),
];

const reply = [
  body("reply")
    .not()
    .isEmpty()
    .withMessage("empty reply")
    .isLength({ min: 1, max: 300 })
    .withMessage("reply is too long"),
];

const message = { string, reply };

export default message;
