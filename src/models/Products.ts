import { pool } from "~/utils";
import { getCurrentTimestamp } from "~/utils";

export interface Product {
  name: string;
  created_at: number;
  purchase_price: number;
  sold_price: number | null;
  sold_at: number | null;
  image_link: string | null;
  user_id: number;
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
