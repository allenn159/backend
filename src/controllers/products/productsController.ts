import { Request, Response, NextFunction } from "express";
import { findOrCreateUser } from "~/models";
import { validationResult } from "express-validator";
import { Product, createProducts as addProducts } from "~/models";

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
