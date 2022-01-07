import { NextFunction, Request, Response } from "express";
import UserRepository from "../../repositories/UserRepository";
import ConfigureLogging from "../../utils/logger/ConfigureLogging";

import { TokenValidateBase, CookieExtraction } from "../auth/AuthenticateBase";
import { TokenValidateDecorator } from "../auth/AuthenticateDecorator";
import AuthController from "./UserController";

export class UserProtect extends AuthController {
  logger: ConfigureLogging;
  constructor(logger: ConfigureLogging) {
    super();
    this.logger = logger;
    this.refreshTokens = this.refreshTokens.bind(this)
  }

  async refreshTokens(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    const cookieExtraction = new CookieExtraction("refresh_token");

    const service = new TokenValidateDecorator(
      new TokenValidateBase(
        cookieExtraction,
        process.env.REFRESH_TOKEN_SECRET!
      ),
      this.logger
    );
    // get token from request
    const token = cookieExtraction.extract(req);

    // get userId
    const { userId } = service.validateToken(req, res);
    if (!userId) {
      throw new Error("UnAthorized, token failed")
    };
    const user = await UserRepository.getInstance().findById(userId);

    // Compare token from request with current token
    if (!user || user.refreshToken !== token) {
      return super.sendError(401, res, "UnAthorized, invalid token");
    }

    req.user = user;
    return super.refreshTokens(req, res, next);
  }
}
