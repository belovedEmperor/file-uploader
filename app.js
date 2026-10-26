import path from "node:path";
import express from "express";

const app = express();
const __dirname = import.meta.dirname;
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

import { prisma } from "./lib/prisma.js";
import passport from "passport";
import passportLocal from "passport-local";
import bcrypt from "bcryptjs";
const LocalStrategy = passportLocal.Strategy;
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = prisma.user.findUnique({
        where: { email: username },
      });

      if (!user) {
        return done(null, false, { message: "Incorrect email" });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: "Incorrect password" });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }),
);
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser((id, done) => {
  try {
    done(
      null,
      prisma.user.findUnique({
        where: { id },
      }),
    );
  } catch (err) {
    done(err);
  }
});

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

const PORT = process.env.SERVER_PORT || 3000;
app.listen(PORT, (errors) => {
  if (errors) {
    throw errors;
  }

  console.log(`Listening on port ${PORT}`);
});
