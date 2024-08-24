import { Router } from "express";
import userRouter from "./User";
import productsRouter from "./Products";

const router = Router();

router.use("/user", userRouter);
router.use("/products", productsRouter);

export default router;
