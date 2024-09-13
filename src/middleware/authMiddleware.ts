import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import { Request, Response, NextFunction } from "express";

const clerkAuth = ClerkExpressRequireAuth();

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  clerkAuth(req, res, (err) => {
    if (err) {
      return next(err);
    }

    next();
  });
};
