import { Router } from "express";
import {
  redirectIfAuth,
  signupGet,
  signupPost,
  loginGet,
  loginPost,
  logoutGet,
} from "../controllers/authController.js";

const authRouter = Router();

authRouter.get("/signup", redirectIfAuth, signupGet);
authRouter.post("/signup", redirectIfAuth, signupPost);
authRouter.get("/login", redirectIfAuth, loginGet);
authRouter.post("/login", redirectIfAuth, loginPost);
authRouter.get("/logout", redirectIfAuth, logoutGet);

export default authRouter;
