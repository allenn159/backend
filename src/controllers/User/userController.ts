import { Request, Response } from "express";
import { findOrCreateUser } from "~/models";

export const getUserInfo = async (req: Request, res: Response) => {
  const userId = req.auth.userId;
  const user = await findOrCreateUser(userId);

  res.status(200).json({ user });
};
