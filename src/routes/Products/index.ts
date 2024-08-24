import { Router } from "express";
import { requireAuth } from "~/middleware";
import { body } from "express-validator";
import { createProducts } from "~/controllers/products/productsController";

const productsRouter = Router();

productsRouter.post(
  "/",
  requireAuth,
  [
    body()
      .isArray({ min: 1, max: 10 })
      .withMessage(
        "Products must be an array with at least 1 and at most 10 items"
      ),
    body("*.name")
      .isString()
      .withMessage("Name must be a string")
      .isLength({ min: 1, max: 255 })
      .withMessage("Name must be between 1 and 255 characters"),
    body("*.created_at")
      .isInt({ gt: 0 })
      .withMessage("Created_at must be a positive integer"),
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
  ],
  createProducts
);

export default productsRouter;
