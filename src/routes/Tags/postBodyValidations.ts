import { body } from "express-validator";
export const createTagValidation = [
  body()
    .isArray({ min: 1, max: 10 })
    .withMessage(
      "Must be an array with a minimum of 1 and a maximum of 10 items"
    ),
  body("*.name")
    .isString()
    .withMessage("Name must be a string")
    .isLength({ min: 1, max: 255 })
    .withMessage("Name must be between 1 and 255 characters"),
  body("*.color")
    .isHexColor()
    .withMessage("Must be a valid hexadecimal color code"),
];
