import { Request, Response, NextFunction } from "express";
import { findOrCreateUser, getProducts } from "~/models";
import { validationResult } from "express-validator";
import {
  Product,
  createProducts as addProducts,
  GetProductParams,
} from "~/models";
import { DEFAULT_LIMIT, DEFAULT_OFFSET } from "~/controllers/utils";

export const createProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const productData: Product[] = req.body;

    const user = await findOrCreateUser(req.auth.userId);
    await addProducts(productData, user.id);

    res.status(201).json({ message: "Product was created successfully!" });
  } catch (error) {
    next(error);
  }
};

export const viewProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  let { limit = DEFAULT_LIMIT, offset = DEFAULT_OFFSET, sort } = req.body;

  if (!sort) {
    sort = {
      created_at: "DESC",
    };
  }

  const params: GetProductParams = {
    ...req.body,
    limit,
    offset,
    sort,
  };

  try {
    // const user = await findOrCreateUser(req.auth.userId);
    const products = await getProducts(params, 2);

    res.status(201).json({ products: products });
  } catch (error) {
    next(error);
  }
};
