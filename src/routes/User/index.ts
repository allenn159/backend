import { Router } from "express";
import { getUserInfo } from "~/controllers/User/userController";
import { requireAuth } from "~/middleware";

const userRouter = Router();

userRouter.get("/", requireAuth, getUserInfo);

export default userRouter;
