import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../../models/userModel";
import Controller, { Methods } from "../../typings/Controller";
import {
  COOKIES_OPTIONS,
  generateRefreshToken,
  generateToken,
} from "../../utils/generateToken";

export const localStrategy = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "email and password required" });
  }
  const user = await User.findOne({ email: email, isActive: true });
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: "UnAuthorized" });
  }
  req.user = user;
  return next();
};

const jwtStrategy = async (req: Request, res: Response, next: NextFunction) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      if (!token) {
        return res.status(401);
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET!);
      if (typeof decoded === "string") {
        return res.status(401);
      }
      req.user = await User.findById(decoded.userId).select("-password");
      return next();
    } catch (error) {
      console.log(error);
      return res.status(500);
    }
  }
};

class UserController extends Controller {
  public path = "/api/user/auth";
  protected routes = [
    {
      path: "/login",
      method: Methods.POST,
      handler: this.login,
      localMiddlewares: [localStrategy],
    },
    {
      path: "/token/refresh",
      method: Methods.GET,
      handler: this.refreshTokens,
      localMiddlewares: [],
    },
    {
      path: "/register",
      method: Methods.POST,
      handler: this.register,
      localMiddlewares: [],
    },
  ];

  constructor() {
    super();
  }

  async login(req: Request, res: Response, _: NextFunction): Promise<any> {
    try {
      const { user } = req;
      const exist = await User.findById(user._id);
      if (!exist) {
        super.sendError(401, res, "UnAuthorized");
      }
      const refreshToken = generateRefreshToken({ userId: exist._id });
      exist.refreshToken = refreshToken;
      await exist.save();
      res.cookie("refresh_token", refreshToken, COOKIES_OPTIONS);
      if (req.register) {
        super.sendSuccess(200, res, null);
      } else {
        super.sendSuccess(200, res, null);
      }
    } catch (error) {
      console.log(error);
      super.sendError(500, res);
    }
  }

  async refreshTokens(
    req: Request,
    res: Response,
    _: NextFunction
  ): Promise<any> {
    try {
      const { signedCookies = {} } = req;
      const { refresh_token: refreshToken } = signedCookies;
      if (!refreshToken) {
        return super.sendError(401, res, "UnAuthorized");
      }
      const payload = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET!
      );
      if (typeof payload === "string") {
        return super.sendError(401, res, "UnAuthorized, token failed");
      }
      const { userId } = payload;
      const user = await User.findById(userId);
      if (!user || user.refreshToken !== refreshToken) {
        return super.sendError(401, res, "UnAuthorized, invalid refresh token");
      }

      const token = generateToken({ userId: user._id });
      const newRefreshToken = generateRefreshToken({ userId: user._id });
      user.refreshToken = newRefreshToken;
      await user.save();
      res.cookie("refresh_token", newRefreshToken, COOKIES_OPTIONS);
      return super.sendSuccess(200, res, { token });
    } catch (error) {
      console.log(error);
      return super.sendError(500, res);
    }
  }

  async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const {
        firstName,
        lastName,
        birthday,
        email,
        password,
        confirmPass,
        phoneNumber,
      } = req.body;
      if (!password || password === undefined) {
        return res.status(400).json({ message: "required password" });
      }

      if (password !== confirmPass) {
        return res
          .status(401)
          .json({ message: "password not match confirmation" });
      }

      const userExists = await User.findOne({ email });

      if (userExists) {
        res.status(400).json({ message: "user already exist" });
      }

      const user = {
        firstName,
        middle_name: "",
        birthday,
        lastName,
        email,
        phoneNumber,
        password,
        active: true,
        emailVerification: false,
      };

      const newUser = await User.create(user);
      req.register = true;
      req.user = newUser;

      // return next();
      return super.sendSuccess(200, res, newUser);
    } catch (error: any) {
      console.log(error);
      // res.status(500).json({ message: error.message });
      return super.sendError(500, res);
    }
  }
}

export default UserController;
