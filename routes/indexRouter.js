import { Router } from "express";
import { redirectIfNotAuth } from "../controllers/authController.js";
import { homeGet } from "../controllers/indexController.js";

const indexRouter = Router();

indexRouter.get("/", redirectIfNotAuth, homeGet);

export default indexRouter;
