import { Request, Response, NextFunction } from "express";
import {
  findOrCreateUser,
  getProducts,
  Product,
  createProducts as addProducts,
  GetProductParams,
  editProduct as modifyProduct,
  getProduct as retrieveProduct,
  deleteProducts as removeProducts,
} from "~/models";
import { validationResult } from "express-validator";

export const createProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const productData: Omit<Product, "id">[] = req.body;

  try {
    const user = await findOrCreateUser(req.auth.userId);
    await addProducts(productData, user.id);

    res.status(201).json({ message: "Product(s) was created successfully!" });
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

  let { sort } = req.body;

  if (!sort) {
    sort = {
      created_at: "DESC",
    };
  }

  const params: GetProductParams = {
    ...req.body,
    sort,
  };

  try {
    const user = await findOrCreateUser(req.auth.userId);
    const products = await getProducts(params, user.id);

    res.status(201).json(products);
  } catch (error) {
    next(error);
  }
};

export const getProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;

  try {
    const user = await findOrCreateUser(req.auth.userId);
    const product = await retrieveProduct(Number(id), user.id);

    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

export const editProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const productData: Product = req.body;

  try {
    const user = await findOrCreateUser(req.auth.userId);
    await modifyProduct(Number(id), productData, user.id);

    res.status(200).json({ message: "Product was edited successfully" });
  } catch (error) {
    next(error);
  }
};

export const deleteProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const productIds: number[] = req.body.productIds;

  try {
    const user = await findOrCreateUser(req.auth.userId);
    await removeProducts(productIds, user.id);

    res.status(200).json({ message: "Product(s) was deleted successfully" });
  } catch (error) {
    next(error);
  }
};
