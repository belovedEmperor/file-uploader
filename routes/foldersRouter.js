import { Router } from "express";
import { redirectIfNotAuth } from "../controllers/authController.js";
import {
  folderCreateGet,
  folderCreatePost,
  folderReadGet,
  folderRenameGet,
  folderRenamePost,
  folderDeletePost,
} from "../controllers/foldersController.js";

const foldersRouter = Router();

foldersRouter.get("/new", redirectIfNotAuth, folderCreateGet);
foldersRouter.post("/new", redirectIfNotAuth, folderCreatePost);

foldersRouter.get("/:id", redirectIfNotAuth, folderReadGet);

foldersRouter.get("/:id/update", redirectIfNotAuth, folderRenameGet);
foldersRouter.post("/:id/update", redirectIfNotAuth, folderRenamePost);

foldersRouter.post("/:id/delete", redirectIfNotAuth, folderDeletePost);

export default foldersRouter;
