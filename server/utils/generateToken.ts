import { CookieOptions } from "express";
import jwt from "jsonwebtoken";

const COOKIES_OPTIONS: CookieOptions = {
  path: "/",
  domain: process.env.NODE_ENV === "development" ? "localhost" : "golf-company.herokuapp.com",
  httpOnly: true,
  secure: true,
  signed: true,
  maxAge: 1296000000,
  sameSite: "none",
};

const generateToken = (payload: Object) => {
  const secret = process.env.JWT_SECRET;
  if (secret) {
    return jwt.sign(payload, secret, {
      expiresIn: eval(process.env.SESSION_EXPIRY!),
    });
  }
  return null;
};

const generateRefreshToken = (payload: Object) => {
  const secret = process.env.REFRESH_TOKEN_SECRET;
  if (secret) {
    return jwt.sign(payload, secret, {
      expiresIn: eval(process.env.REFRESH_TOKEN_EXPIRY!),
    });
  }
  return null;
};

export { generateToken, generateRefreshToken, COOKIES_OPTIONS };
