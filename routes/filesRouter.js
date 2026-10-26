import { Router } from "express";
const filesRouter = Router();
import {
  redirectIfAuth,
  redirectIfNotAuth,
  signupGet,
  signupPost,
  loginGet,
  loginPost,
  logoutGet,
} from "../controllers/filesController.js";

filesRouter.get("/signup", redirectIfAuth, signupGet);
filesRouter.post("/signup", redirectIfAuth, signupPost);
filesRouter.get("/login", redirectIfAuth, loginGet);
filesRouter.post("/login", redirectIfAuth, loginPost);
filesRouter.get("/logout", redirectIfAuth, logoutGet);

export default filesRouter;
