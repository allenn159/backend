import { Request, Response } from "express";

export const getPublicData = (req: Request, res: Response) => {
  res.status(200).send({ message: "Here is a successful request!" });
};
