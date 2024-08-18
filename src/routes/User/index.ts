import { Router } from "express";
import { getPublicData } from "~/controllers/User/userController";
import { requireAuth } from "~/middleware/index";

const userRouter = Router();

userRouter.get("/", getPublicData);

export default userRouter;
