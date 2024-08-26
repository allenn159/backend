import { Router } from "express";
import userRouter from "./User";
import productsRouter from "./Products";
import tagsRouter from "./Tags";

const router = Router();

router.use("/user", userRouter);
router.use("/products", productsRouter);
router.use("/tags", tagsRouter);

export default router;
