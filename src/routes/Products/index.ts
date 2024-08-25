import { Router } from "express";
import { requireAuth } from "~/middleware";
import {
  createProducts,
  viewProducts,
} from "~/controllers/products/productsController";
import {
  createProductsValidation,
  viewProductsValidation,
} from "./postBodyValidations";

const productsRouter = Router();

productsRouter.post("/", requireAuth, createProductsValidation, createProducts);
productsRouter.post("/view", requireAuth, viewProductsValidation, viewProducts);

export default productsRouter;
