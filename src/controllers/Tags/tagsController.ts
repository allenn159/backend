import { Request, Response } from "express";
import { findOrCreateUser } from "~/models";
import { getTags as fetchTags, GetTagsQueryParams } from "~/models/Tags";
import { validationResult } from "express-validator";

export const getTags = async (req: Request, res: Response) => {
  const params = req.query as GetTagsQueryParams;
  const userId = req.auth.userId;
  const user = await findOrCreateUser(userId);

  const tags = await fetchTags(params, user.id);

  res.status(200).json({ tags: tags });
};

export const createTag = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  res.status(201).json({ message: "Tag was successfully created!" });
};
