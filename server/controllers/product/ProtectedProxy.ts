import { NextFunction, Request, Response } from "express";
import EmployeeRepository from "../../repositories/employeeModel";
import UserRepository from "../../repositories/UserRepository";
import { UserTypes } from "../../types/userTypes";
import ConfigureLogging from "../../utils/logger/ConfigureLogging";
import { TokenValidateBase, HeaderExtract } from "../auth/AuthenticateBase";
import { TokenValidateDecorator } from "../auth/AuthenticateDecorator";
import ProductController from "./ProductController";

export default class ProductProtect extends ProductController {
  logger: ConfigureLogging;
  constructor(logger: ConfigureLogging) {
    super();
    this.logger = logger;
  }

  async getUserInfo(req: Request, res: Response): Promise<UserTypes> {
    const service = new TokenValidateDecorator(
      new TokenValidateBase(new HeaderExtract(), process.env.JWT_SECRET!),
      this.logger
    );
    const {userId} =await service.validateToken(req,res)
    const user = await UserRepository.getInstance().findById(userId)
    return user
  }

  async createGolf(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      // validate bearer token
      const service = new TokenValidateBase(
        new HeaderExtract(),
        process.env.JWT_SECRET!
      );

      const { employeeId } = service.validateToken(req, res);

      const employee = await EmployeeRepository.getInstance().findById(
        employeeId
      );
      if (!employee) {
        return super.sendError(401, res, "UnAuthorized");
      }
      req.user = employee;
      return super.createGolf(req, res, next);
    } catch (error) {
      return super.sendError(401, res, "UnAuthorized");
    }
  }

}
