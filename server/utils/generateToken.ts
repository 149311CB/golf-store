import jwt from "jsonwebtoken";

const COOKIES_OPTIONS = {
  path: "/",
  domain: "localhost",
  httpOnly: true,
  secure: false,
  signed: true,
  maxAge: 1296000000,
  samesite: "none",
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
