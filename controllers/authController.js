import bcrypt from "bcryptjs";
import passport from "passport";
import { prisma } from "../lib/prisma.js";
import { body, validationResult, matchedData } from "express-validator";

export const redirectIfAuth = (req, res, next) =>
  req.isAuthenticated() ? res.redirect("/") : next();
export const redirectIfNotAuth = (req, res, next) =>
  req.isAuthenticated() ? next() : res.redirect("/login");

const emptyErr = "must not be empty.";
const whitespaceErr = "must not contain whitespace.";
const passwordLengthErr = "must be between or equal to 8 and 25 characters.";

const whitespaceValidator = (value) => {
  return value.includes(" ") ? false : true;
};

const validateAccountExists = [
  body("email")
    .trim()
    .custom(async (email) => {
      return (await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
      }))
        ? true
        : false;
    })
    .withMessage("No account with that email exists."),
];

const validateSignupInfo = [
  body("email").trim().notEmpty().withMessage(`Email ${emptyErr}`),
  body("email")
    .custom(whitespaceValidator)
    .withMessage(`Email ${whitespaceErr}`),
  body("email").trim().isEmail().withMessage(`Email must be valid.`),
  body("password").trim().notEmpty().withMessage(`Password ${emptyErr}`),
  body("password")
    .isLength({ min: 8, max: 25 })
    .withMessage(`Password ${passwordLengthErr}`),
  body("password")
    .custom(whitespaceValidator)
    .withMessage(`Password ${whitespaceErr}`),
  body("password")
    .isStrongPassword({ minLowercase: 1, minUppercase: 1 })
    .withMessage(
      `Password must have at least 1 lowercase and 1 uppercase letter.`,
    ),
  body("password")
    .isStrongPassword({ minNumbers: 1 })
    .withMessage(`Password must have at least 1 number.`),
  body("password")
    .isStrongPassword({ minSymbols: 1 })
    .withMessage(`Password must have at least 1 symbol.`),
  body("confirmPassword")
    .trim()
    .notEmpty()
    .withMessage(`Password confirmation ${emptyErr}`),
  body("confirmPassword")
    .custom(whitespaceValidator)
    .withMessage(`Password confirmation ${whitespaceErr}`),
  body("confirmPassword")
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage(`Password confirmation ${whitespaceErr}`),
];

export function signupGet(_, res) {
  res.render("signupForm");
}

export const signupPost = [
  validateSignupInfo,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("signupForm", {
        errors: errors.array(),
      });
    }

    try {
      const { email, password } = matchedData(req);
      const hashedPassword = await bcrypt.hash(password, 10);
      await prisma.user.create({
        data: {
          email: email.toLowerCase(),
          password: hashedPassword,
        },
      });
      res.redirect("/auth/login");
    } catch (err) {
      console.error(err);
      next(err);
    }
  },
];

export function loginGet(req, res) {
  res.render("loginForm", {
    errors: req.session.messages?.length
      ? req.session.messages.map((msg) => msg.message ?? msg)
      : undefined,
  });
  req.session.messages = [];
}

export const loginPost = [
  validateAccountExists,
  [body("password").notEmpty().withMessage(`Password ${emptyErr}`)],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("loginForm", {
        errors: errors.array(),
      });
    }

    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/auth/login",
      failureMessage: true,
    })(req, res);
  },
];

export function logoutGet(req, res, next) {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
}
