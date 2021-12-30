import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/userModel";
import { NextFunction, Request, Response } from "express";

const protect = asyncHandler(async (req, res, next) => {
  let token;
  try {
    const result = verifyToken(req);
    if (result) {
      // @ts-ignore
      const { userId, ...rest } = result;
      // if the user exist in token, use user
      if (userId) {
        const user = await User.getInstance().findById(userId, "-password");
        req.body = { ...req.body, rest, user };
        return next();
      }
      return res.status(401).json({ message: "Not authorized, token found" });
    }
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, token failed" });
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
});

export const verifyToken = (req: any) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
    if (token !== "null") {
      const secret = process.env.JWT_SECRET;
      if (secret) {
        return jwt.verify(token, secret);
      }
    }
  }
  return {};
};

export { protect };

export async function jwtValidate(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {
  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      let token;
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET!);
      if (typeof decoded === "string") {
        return res.status(400).json({ message: "invalid token" });
      }

      const user = await User.getInstance().findById(decoded.userId);
      if (!user) {
        return res.status(401).json({ message: "UnAuthorized" });
      }
      req.user = user;
      return next();
    }
    return res.status(401).json({ message: "UnAuthorized" });
  } catch (error) {
    return res.status(401).json({ message: "UnAuthorized" });
  }
}

