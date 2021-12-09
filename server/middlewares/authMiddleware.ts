import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/userModel";
import expressAsyncHandler from "express-async-handler";

const protect = asyncHandler(async (req, res, next) => {
  let token;
  try {
    const result = verifyToken(req);
    if (result) {
      console.log(result)
      // @ts-ignore
      const { userId, ...rest } = result;
      // if the user exist in token, use user
      if (userId) {
        const user = await User.findById(userId).select("-password");
        req.body = { ...req.body, rest, user };
        return next();
      }
      return res.status(401).json({ message: "Not authorized, token found" });
      // throw new Error("Not authorized, token found");
    }
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, token failed" });
    // throw new Error("Not authorized, token failed");
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
    // throw new Error("Not authorized, no token");
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
        const decoded = jwt.verify(token, secret);
        return decoded;
      }
    }
  }
  return {};
};

export { protect };
