import { Router } from "express";
import { requireAuth } from "~/middleware";
import { getTags, createTag } from "~/controllers/Tags/tagsController";
import { createTagValidation } from "./postBodyValidations";

const tagsRouter = Router();

tagsRouter.get("/", requireAuth, getTags);
tagsRouter.post("/", requireAuth, createTagValidation, createTag);

export default tagsRouter;
