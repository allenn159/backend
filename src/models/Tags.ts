import { pool } from "~/utils";

interface Tag {
  id: number;
  user_id: string;
  name: string;
  created_at: number;
  color: string;
}

export interface GetTagsQueryParams {
  searchTerm?: string;
}

export async function getTags(queryParams: GetTagsQueryParams, userId: number) {
  const { searchTerm } = queryParams;

  let baseGetTagsQuery = `SELECT id, name, color from tags WHERE user_id = ?`;
  const params: (string | number | undefined)[] = [userId];

  if (searchTerm) {
    baseGetTagsQuery += ` AND name LIKE ?`;
    params.push(`%${searchTerm}%`);
  }

  try {
    const tags = await pool.query(baseGetTagsQuery, params);

    return tags[0] as Omit<Tag, "user_id">[];
  } catch (error) {
    throw {
      status: 500,
      message: `An error occurred while attempting to get products. Please try again later.`,
      originalError: error,
    };
  }
}
