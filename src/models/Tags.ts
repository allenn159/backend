import { pool } from "~/utils";
import { getCurrentTimestamp } from "~/utils";

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

export async function createTags(
  tags: Pick<Tag, "name" | "color">[],
  userId: number
) {
  for (let tag of tags) {
    await createTag(tag, userId);
  }
}

export async function createTag(
  tag: Pick<Tag, "name" | "color">,
  userId: number
) {
  const { name, color } = tag;
  const createTagQuery = `INSERT INTO tags (name, color, created_at, user_id) VALUES (?, ?, ?, ?)`;

  try {
    await pool.query(createTagQuery, [
      name,
      color,
      getCurrentTimestamp(),
      userId,
    ]);
  } catch (error) {
    throw {
      status: 500,
      message: `An error occurred while creating a tag with the name ${name}. Please try again later.`,
      originalError: error,
    };
  }
}
