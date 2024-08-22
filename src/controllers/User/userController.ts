import { Request, Response } from "express";
import { getUser, createUser } from "~/models";

export const getUserInfo = async (req: Request, res: Response) => {
  const userId = req.auth.userId;
  let user = await getUser(userId);

  if (!user) {
    user = await createUser(userId);
  }

  res.status(200).send({ user });
};
