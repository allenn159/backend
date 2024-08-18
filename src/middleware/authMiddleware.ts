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
      return next(err); // Pass authentication errors to the global error handler
    }
    next(); // Proceed to the next middleware or route handler if authenticated
  });
};
