import { pool } from "~/utils";

export interface Product {
  name: string;
  created_at: number;
  purchase_price: number;
  sold_price: number | null;
  sold_at: number | null;
  image_link: string | null;
  user_id: number;
}

export interface GetProductParams {
  limit?: number;
  offset?: number;
  searchTerm?: string;
  dateRange?: {
    from: number;
    to: number;
  };
  sort?: {
    name?: "ASC" | "DESC";
    created_at?: "ASC" | "DESC";
  };
}

export async function createProducts(products: Product[], userId: number) {
  for (let product of products) {
    await createProduct(product, userId);
  }
}

async function createProduct(product: Product, userId: number) {
  try {
    const {
      name,
      created_at,
      purchase_price,
      sold_price,
      sold_at,
      image_link,
    } = product;
    const createProductQuery = `INSERT INTO products (name, created_at, purchase_price, sold_price, sold_at, image_link, user_id)
  VALUES (?, ?, ?, ?, ?, ?, ?)`;

    await pool.query(createProductQuery, [
      name,
      created_at,
      purchase_price,
      sold_price,
      sold_at,
      image_link,
      userId,
    ]);
  } catch (error) {
    throw {
      status: 500,
      message: `An error occurred while creating the product with the name ${product.name}. Please try again later.`,
      originalError: error,
    };
  }
}

export async function getProducts(params: GetProductParams, userId: number) {
  const { limit, offset, searchTerm, dateRange, sort } = params;

  let baseGetProductsQuery = `SELECT id, name, created_at, purchase_price, sold_price, sold_at from products WHERE user_id = ?`;
  const queryParams: (string | number | undefined)[] = [userId];

  if (searchTerm) {
    baseGetProductsQuery += ` AND name LIKE ?`;
    queryParams.push(`%${searchTerm}%`);
  }

  if (dateRange) {
    baseGetProductsQuery += ` AND created_at >= ? AND created_at <= ?`;
    queryParams.push(dateRange.from, dateRange.to);
  }

  if (sort) {
    if (sort.name) {
      if (sort.name === "ASC") {
        baseGetProductsQuery += ` ORDER BY name ASC`;
      } else {
        baseGetProductsQuery += ` ORDER BY name DESC`;
      }
    }

    if (sort.created_at) {
      if (sort.created_at === "ASC") {
        baseGetProductsQuery += ` ORDER BY created_at ASC`;
      } else {
        baseGetProductsQuery += ` ORDER BY created_at DESC`;
      }
    }
  }

  baseGetProductsQuery += ` LIMIT ? OFFSET ?`;
  queryParams.push(limit, offset);

  try {
    const products = await pool.query(baseGetProductsQuery, queryParams);

    return products[0];
  } catch (error) {
    throw {
      status: 500,
      message: `An error occurred while attempting to get products. Please try again later.`,
      originalError: error,
    };
  }
}
