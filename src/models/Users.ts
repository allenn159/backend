import { pool } from "~/utils";
import { getCurrentTimestamp } from "~/utils";

interface User {
  id: number;
  user_id: string;
  created_at: number;
}

export async function findOrCreateUser(userId: string) {
  try {
    const findUserSql = `SELECT id, created_at FROM users WHERE user_id = ?`;
    const [rows] = await pool.query(findUserSql, [userId]);

    const users = rows as User[];

    if (users.length > 0) {
      return users[0];
    } else {
      const createUserSql = `
      INSERT INTO users (user_id, created_at)
      VALUES (?, ?)
    `;

      const now = getCurrentTimestamp();
      await pool.query(createUserSql, [userId, now]);

      const [rows] = await pool.query(findUserSql, [userId]);

      const users = rows as User[];

      return users[0];
    }
  } catch (error) {
    throw error;
  }
}
