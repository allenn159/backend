import { Router } from "express";
import { getPublicData } from "~/controllers/User/userController";
import { requireAuth } from "~/middleware/index";

const userRouter = Router();

userRouter.get("/", requireAuth, getPublicData);

export default userRouter;
