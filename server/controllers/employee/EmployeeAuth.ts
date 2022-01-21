import { NextFunction, Request, Response } from "express";
import EmployeeRepository from "../../repositories/employeeModel";
import Controller, { Methods } from "../../typings/Controller";
import jwt from "jsonwebtoken";
import {
  COOKIES_OPTIONS,
  generateRefreshToken,
  generateToken,
} from "../../utils/generateToken";
import { routeConfig } from "../../middlewares/routeConfig";

export class EmployeeAuth extends Controller {
  public path = "/api/employee/";
  public routes = [
    {
      path: "/auth/login",
      method: Methods.POST,
      handler: this.login,
      localMiddlewares: [],
    },
    {
      path: "/auth/token/refresh",
      method: Methods.GET,
      handler: this.refreshToken,
      localMiddlewares: [],
    },
  ];

  @routeConfig({ method: "post", path: "/api/employee" + "/auth/login" })
  async login(req: Request, res: Response, _: NextFunction): Promise<any> {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return super.sendError(400, res, "required email and password");
      }
      const exist = await EmployeeRepository.findOne({ email: email });

      // @ts-ignore
      if (!exist || !(await exist.matchPassword(password))) {
        return super.sendError(401, res, "UnAuthorized");
      }

      const refreshToken = generateRefreshToken({ employeeId: exist._id });
      exist.refreshToken = refreshToken!;
      await exist.save();
      res.cookie("refresh_token", refreshToken, COOKIES_OPTIONS);

      return super.sendSuccess(200, res, null);
    } catch (error) {
      console.log(error);
      return super.sendError(500, res);
    }
  }

  @routeConfig({ method: "get", path: "/api/employee" + "/auth/token/refresh" })
  async refreshToken(
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

      const { employeeId } = payload;
      const exist = await EmployeeRepository.findById(employeeId);

      if (!exist || exist.refreshToken !== refreshToken) {
        return super.sendError(401, res, "UnAuthorized, invalid refresh token");
      }

      const token = generateToken({ employeeId: exist._id });
      const newRefreshToken = generateRefreshToken({
        employeeId: exist._id,
      });
      exist.refreshToken = newRefreshToken!;
      await exist.save();
      res.cookie("refresh_token", newRefreshToken, COOKIES_OPTIONS);
      return super.sendSuccess(200, res, { token });
    } catch (error) {
      console.log(error);
      return super.sendError(500, res);
    }
  }
}
