import { validationResult } from "express-validator";
import APIResponse from "../helpers/APIResponse";

export function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array({ onlyFirstError: true })[0];
    console.log(firstError);
    return APIResponse.validationErrorWithData(
      res,
      firstError,
      firstError?.msg
    );
  }
  next();
}
