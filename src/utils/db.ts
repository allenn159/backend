import mysql, { Pool, PoolConnection } from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export const withTransaction = async <T>(
  transactionFunction: (conn: PoolConnection) => Promise<T>
): Promise<T> => {
  const connection = await pool.getConnection();

  try {
    // Start the transaction
    await connection.beginTransaction();

    // Execute the provided function with the transaction connection
    const result = await transactionFunction(connection);

    // Commit the transaction if successful
    await connection.commit();

    return result;
  } catch (error) {
    // Rollback the transaction in case of an error
    await connection.rollback();
    throw error; // Re-throw the error so it can be handled by the caller
  } finally {
    // Release the connection back to the pool
    connection.release();
  }
};
