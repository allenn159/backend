import { pool, withTransaction } from "~/utils";
import { DEFAULT_LIMIT, DEFAULT_OFFSET } from "~/controllers/utils";
import { getCurrentTimestamp } from "~/utils";
import { ResultSetHeader } from "mysql2/promise";

export interface Product {
  name: string;
  purchase_price: number;
  sold_price: number | null;
  sold_at: number | null;
  image_link: string | null;
  user_id: number;
  tags:
    | {
        id: number;
        name: string;
        color: string;
      }[]
    | null;
  fees: number | null;
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
    withTransaction(async (connection) => {
      const {
        name,
        purchase_price,
        sold_price,
        sold_at,
        image_link,
        fees,
        tags,
      } = product;
      const createProductQuery = `INSERT INTO products (name, created_at, purchase_price, sold_price, sold_at, image_link, fees, user_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

      const [result] = await connection.query<ResultSetHeader>(
        createProductQuery,
        [
          name,
          getCurrentTimestamp(),
          purchase_price,
          sold_price,
          sold_at,
          image_link,
          fees,
          userId,
        ]
      );

      const productId = result.insertId;

      if (tags && tags.length > 0) {
        const insertTagQuery = `INSERT INTO product_tags (product_id, tag_id) VALUES (?, ?)`;

        for (const tagId of tags) {
          await connection.query(insertTagQuery, [productId, tagId]);
        }
      }
    });
  } catch (error) {
    throw {
      status: 500,
      message: `An error occurred while creating the product with the name ${product.name}. Please try again later.`,
      originalError: error,
    };
  }
}

export async function getProducts(params: GetProductParams, userId: number) {
  const {
    limit = DEFAULT_LIMIT,
    offset = DEFAULT_OFFSET,
    searchTerm,
    dateRange,
    sort,
  } = params;

  let baseGetProductsQuery = `
    SELECT 
      p.id, 
      p.name, 
      p.created_at, 
      p.purchase_price, 
      p.sold_price, 
      p.sold_at,
      p.fees,
      CASE 
        WHEN COUNT(t.id) > 0 THEN JSON_ARRAYAGG(JSON_OBJECT('id', t.id, 'name', t.name, 'color', t.color, 'text_color', t.text_color))
        ELSE NULL
      END AS tags
    FROM 
      products p
    LEFT JOIN 
      product_tags pt ON p.id = pt.product_id
    LEFT JOIN 
      tags t ON pt.tag_id = t.id
    WHERE 
      p.user_id = ?
    `;
  const queryParams: (string | number | undefined)[] = [userId];

  if (searchTerm) {
    baseGetProductsQuery += ` AND p.name LIKE ?`;
    queryParams.push(`%${searchTerm}%`);
  }

  if (dateRange) {
    baseGetProductsQuery += ` AND p.created_at >= ? AND p.created_at <= ?`;
    queryParams.push(dateRange.from, dateRange.to);
  }

  baseGetProductsQuery += `
    GROUP BY 
      p.id, p.name, p.created_at, p.purchase_price, p.sold_price, p.sold_at, p.fees`;

  if (sort) {
    if (sort.name) {
      if (sort.name === "ASC") {
        baseGetProductsQuery += ` ORDER BY p.name ASC`;
      } else {
        baseGetProductsQuery += ` ORDER BY p.name DESC`;
      }
    }

    if (sort.created_at) {
      if (sort.created_at === "ASC") {
        baseGetProductsQuery += ` ORDER BY p.created_at ASC`;
      } else {
        baseGetProductsQuery += ` ORDER BY p.created_at DESC`;
      }
    }
  }

  baseGetProductsQuery += ` LIMIT ? OFFSET ?`;
  queryParams.push(limit, offset);

  try {
    const products = await pool.query(baseGetProductsQuery, queryParams);

    return products[0];
  } catch (error) {
    console.log(error);
    throw {
      status: 500,
      message: `An error occurred while attempting to get products. Please try again later.`,
      originalError: error,
    };
  }
}
