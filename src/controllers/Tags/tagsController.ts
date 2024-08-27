import { Request, Response, NextFunction } from "express";
import { findOrCreateUser } from "~/models";
import {
  getTags as fetchTags,
  GetTagsQueryParams,
  createTags,
} from "~/models/Tags";
import { validationResult } from "express-validator";

export const getTags = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const params = req.query as GetTagsQueryParams;
  const userId = req.auth.userId;

  try {
    const user = await findOrCreateUser(userId);

    const tags = await fetchTags(params, user.id);

    res.status(200).json({ tags: tags });
  } catch (error) {
    next(error);
  }
};

export const createTag = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const tags = req.body;

    const user = await findOrCreateUser(req.auth.userId);
    await createTags(tags, user.id);
    res.status(201).json({ message: "Tag(s) was successfully created!" });
  } catch (error) {
    next(error);
  }
};
