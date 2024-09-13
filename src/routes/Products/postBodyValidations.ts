import { body } from "express-validator";
import { validateAllowedFields } from "~/utils";

export const createProductsValidation = [
  body()
    .isArray({ min: 1, max: 10 })
    .withMessage(
      "Products must be an array with at least 1 and at most 10 items"
    )
    .custom((products) => {
      const allowedFields = [
        "name",
        "purchase_price",
        "sold_price",
        "sold_at",
        "image_link",
        "fees",
        "tags",
      ];

      validateAllowedFields(products, allowedFields);
      return true;
    }),
  body("*.name")
    .isString()
    .withMessage("Name must be a string")
    .isLength({ min: 1, max: 255 })
    .withMessage("Name must be between 1 and 255 characters"),
  body("*.purchase_price")
    .custom((value) => {
      // Check if the value is a decimal with up to 2 decimal places
      return /^\d+(\.\d{1,2})?$/.test(value);
    })
    .withMessage(
      "purchase_price must be a decimal number with up to two decimal places"
    ),
  body("*.sold_price")
    .optional()
    .custom((value) => {
      // Check if the value is a decimal with up to 2 decimal places
      return /^\d+(\.\d{1,2})?$/.test(value);
    })
    .withMessage(
      "sold_price must be a decimal number with up to two decimal places"
    ),
  body("*.sold_at")
    .optional()
    .isInt({ gt: 0 })
    .withMessage("Sold_at must be a positive integer"),
  body("*.image_link")
    .optional()
    .isURL()
    .withMessage("Image_link must be a valid URL"),
  body("*.fees")
    .optional()
    .custom((value) => {
      // Check if the value is a decimal with up to 2 decimal places
      return /^\d+(\.\d{1,2})?$/.test(value);
    })
    .withMessage("Fees must be a decimal number with up to two decimal places"),
  body("*.tags")
    .optional()
    .isArray({ min: 1 })
    .withMessage(
      "Numbers must be provided as an array with at least one tag id"
    )
    .custom((value) => {
      for (let num of value) {
        if (typeof num !== "number") {
          throw new Error("Array must only contain numbers");
        }
      }
      return true;
    }),
];

export const viewProductsValidation = [
  body("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be an integer between 1 and 100")
    .toInt(),
  body("offset")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Offset must be a non-negative integer")
    .toInt(),
  body("searchTerm")
    .optional()
    .isString()
    .isLength({ min: 0, max: 255 })
    .withMessage("Search term must be between 1 and 255 characters"),
  body("dateRange")
    .optional()
    .custom((value) => {
      const { from, to } = value;

      if (from === undefined || to === undefined) {
        throw new Error("Both `from` and `to` fields must be provided.");
      }

      const isValidFrom =
        Number.isInteger(from) && from >= 0 && from.toString().length <= 10;
      const isValidTo =
        Number.isInteger(to) && to >= 1 && to.toString().length <= 10;

      if (!isValidFrom || !isValidTo) {
        throw new Error(
          "`From` and `To` must be integers between 1 and 10 digits."
        );
      }

      if (from > to) {
        throw new Error("`From` must be less than or equal to `To`.");
      }

      return true;
    }),
  body("sort").optional().isObject().withMessage("Sort must be an object"),
  body("sort.name")
    .optional()
    .isString()
    .isIn(["ASC", "DESC"])
    .withMessage('Name must be either "ASC" or "DESC"'),

  body("sort.created_at")
    .optional()
    .isString()
    .isIn(["ASC", "DESC"])
    .withMessage('Created_at must be either "ASC" or "DESC"'),

  body().custom((reqBody) => {
    const sort = reqBody.sort;
    if (sort) {
      const keys = Object.keys(sort);

      if (keys.length > 1) {
        throw new Error("You can only select one sort option at a time.");
      }
      if (keys.length === 0) {
        throw new Error(
          "You must specify at least one sort option if providing the sort param."
        );
      }
    }
    return true;
  }),
];

export const editProductValidation = [
  body("name")
    .isString()
    .withMessage("Name must be a string")
    .isLength({ min: 1, max: 255 })
    .withMessage("Name must be between 1 and 255 characters"),
  body("purchase_price")
    .custom((value) => {
      // Check if the value is a decimal with up to 2 decimal places
      return /^\d+(\.\d{1,2})?$/.test(value);
    })
    .withMessage(
      "purchase_price must be a decimal number with up to two decimal places"
    ),
  body("sold_price")
    .optional()
    .custom((value) => {
      // Check if the value is a decimal with up to 2 decimal places
      return /^\d+(\.\d{1,2})?$/.test(value);
    })
    .withMessage(
      "sold_price must be a decimal number with up to two decimal places"
    ),
  body("sold_at")
    .optional()
    .isInt({ gt: 0 })
    .withMessage("Sold_at must be a positive integer"),
  body("image_link")
    .optional()
    .isURL()
    .withMessage("Image_link must be a valid URL"),
  body("fees")
    .optional()
    .custom((value) => {
      // Check if the value is a decimal with up to 2 decimal places
      return /^\d+(\.\d{1,2})?$/.test(value);
    })
    .withMessage("Fees must be a decimal number with up to two decimal places"),
  body("tags")
    .optional()
    .isArray({ min: 1 })
    .withMessage("Tags must be an array with at least one tag id")
    .custom((value) => {
      for (let num of value) {
        if (typeof num !== "number") {
          throw new Error("Tags array must only contain numbers");
        }
      }
      return true;
    }),
];

export const deleteProductsValidation = [
  body("productIds")
    .isArray({ min: 1 })
    .withMessage("Numbers array must have at least one element")
    .custom((value) => {
      for (let num of value) {
        if (typeof num !== "number") {
          throw new Error("All elements in the array must be numbers");
        }
      }
      return true;
    }),
];
