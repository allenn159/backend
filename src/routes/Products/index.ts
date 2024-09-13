import { Router } from "express";
import { requireAuth } from "~/middleware";
import {
  createProducts,
  viewProducts,
  editProduct,
  getProduct,
  deleteProducts,
} from "~/controllers/products/productsController";
import {
  createProductsValidation,
  viewProductsValidation,
  editProductValidation,
  deleteProductsValidation,
} from "./postBodyValidations";

const productsRouter = Router();

productsRouter.post("/view", requireAuth, viewProductsValidation, viewProducts);
productsRouter.post("/", requireAuth, createProductsValidation, createProducts);
productsRouter.delete(
  "/",
  requireAuth,
  deleteProductsValidation,
  deleteProducts
);
productsRouter.put("/:id", requireAuth, editProductValidation, editProduct);
productsRouter.get("/:id", requireAuth, getProduct);

export default productsRouter;
