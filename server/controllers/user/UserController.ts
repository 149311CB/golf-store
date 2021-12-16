import {NextFunction, Request, Response} from "express";
import jwt from "jsonwebtoken";
import User from "../../models/userModel";
import Controller, {Methods} from "../../typings/Controller";
import {COOKIES_OPTIONS, generateRefreshToken, generateToken,} from "../../utils/generateToken";
import {GoogleStrategy} from "./strategies/authentication/GoogleStrategy";
import {LocalValidation} from "./strategies/authentication/LocalStrategy";
import {AuthRequest} from "./strategies/authentication/AuthRequest";
import {FacebookStrategy} from "./strategies/authentication/FacebookStrategy";
import {UserTypes} from "../../types/userTypes";
import {jwtValidate} from "../../middlewares/authMiddleware";

class AuthController extends Controller {
  public path = "/api/user/auth";
  protected routes = [
    {
      path: "/login",
      method: Methods.POST,
      handler: this.login,
      localMiddlewares: [],
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
    {
      path: "/login/google",
      method: Methods.GET,
      handler: this.google,
      localMiddlewares: [],
    },
    {
      path: "/login/google/callback",
      method: Methods.GET,
      handler: this.googleCallback,
      localMiddlewares: [],
    },
    {
      path: "/login/facebook",
      method: Methods.GET,
      handler: this.facebook,
      localMiddlewares: [],
    },
    {
      path: "/login/facebook/callback",
      method: Methods.GET,
      handler: this.facebookCallback,
      localMiddlewares: [],
    },
    {
      path: "/details",
      method: Methods.GET,
      handler: this.getuserDetails,
      localMiddlewares: [jwtValidate],
    },
  ];

  constructor() {
    super();
  }

  async login(req: Request, res: Response, _: NextFunction): Promise<any> {
    try {
      const { email, password } = req.body;
      const request = new AuthRequest(new LocalValidation(email, password));

      const user = await request.verify();

      if (!user) {
        return res.status(401).json("UnAuthorized");
      }

      res.cookie("refresh_token", user.refreshToken, COOKIES_OPTIONS);

      return super.sendSuccess(200, res, null);
    } catch (error) {
      console.log(error);
      super.sendError(500, res);
    }
  }

  async google(_: Request, res: Response, __: NextFunction): Promise<any> {
    const scope = [
      "https%3A//www.googleapis.com/auth/userinfo.email",
      "https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile",
    ];
    const redirect_uri =
      "https://localhost:5001/api/user/auth/login/google/callback";

    res.redirect(
      `https://accounts.google.com/o/oauth2/v2/auth?scope=${scope.join(
        "+"
      )}&access_type=offline&include_granted_scopes=true&response_type=code&state=state_parameter_passthrough_value&redirect_uri=${redirect_uri}&client_id=${
        process.env.GOOGLE_CLIENT_ID
      }`
    );
  }

  async googleCallback(
    req: Request,
    res: Response,
    _: NextFunction
  ): Promise<any> {
    try {
      const { code } = req.query;
      const request = new AuthRequest(new GoogleStrategy(code as string));
      const user = await request.verify();

      if (user) {
        res.cookie("refresh_token", user.refreshToken, COOKIES_OPTIONS);
      }

      return res.redirect("https://localhost:3000");
    } catch (error) {
      console.log(error);
      return res.redirect("https://localhost:3000");
    }
  }

  async facebook(req: Request, res: Response, __: NextFunction): Promise<any> {
    const redirect_uri = `https://localhost:5001/api/user/auth/login/facebook/callback`;
    const uri = `https://www.facebook.com/v12.0/dialog/oauth?client_id=${process.env.FACEBOOK_APP_ID}&redirect_uri=${redirect_uri}&scope=public_profile,email`;
    req.strategy = "facebook";
    res.redirect(uri);
  }

  async facebookCallback(
    req: Request,
    res: Response,
    _: NextFunction
  ): Promise<any> {
    try {
      const { code } = req.query;
      const request = new AuthRequest(new FacebookStrategy(code as string));
      const user = await request.verify();

      if (user) {
        res.cookie("refresh_token", user.refreshToken, COOKIES_OPTIONS);
      }

      return res.redirect("https://localhost:3000");
    } catch (error) {
      return res.redirect("https://localhost:3000");
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

  async register(req: Request, res: Response, _: NextFunction): Promise<any> {
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
      if (!password) {
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

  async getuserDetails(
    req: Request,
    res: Response,
    _: NextFunction
  ): Promise<any> {
    const query = req.query;
    let select = Object.keys(query).join(" ");
    if (!/\S/.test(select) || select === null || select === undefined) {
      select = "-password -refresh_token";
    }

    if (!req.user) {
      return res.status(401);
    }
    const user = await User.findById(req.user._id).select(select);
    try {
      return res.status(200).json(user);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
}
export default AuthController;
