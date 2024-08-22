import { pool } from "~/utils";
import { getCurrentTimestamp } from "~/utils";

interface User {
  id: number;
  user_id: string;
  created_at: number;
  is_subscribed: boolean;
}

export async function getUser(userId: string) {
  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE user_id = ?", [
      userId,
    ]);

    const users = rows as User[];
    return users.length > 0 ? users[0] : null;
  } catch (error) {
    throw error;
  }
}

export async function createUser(userId: string) {
  try {
    const sql = `
      INSERT INTO users (user_id, created_at)
      VALUES (?, ?)
    `;

    const now = getCurrentTimestamp();
    await pool.query(sql, [userId, now]);

    return getUser(userId);
  } catch (error) {
    throw error;
  }
}
