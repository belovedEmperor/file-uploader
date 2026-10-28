import { Router } from "express";
import { redirectIfNotAuth } from "../controllers/authController.js";
import {
  fileCreateGet,
  fileCreatePost,
  fileReadGet,
  fileRenameGet,
  fileRenamePost,
  fileDeletePost,
} from "../controllers/filesController.js";

const filesRouter = Router();

filesRouter.get("/upload", redirectIfNotAuth, fileCreateGet);
filesRouter.post("/upload", redirectIfNotAuth, fileCreatePost);
filesRouter.get("/:id", redirectIfNotAuth, fileReadGet);
filesRouter.get("/:id/rename", redirectIfNotAuth, fileRenameGet);
filesRouter.post("/:id/rename", redirectIfNotAuth, fileRenamePost);
filesRouter.post("/:id/delete", redirectIfNotAuth, fileDeletePost);

export default filesRouter;
