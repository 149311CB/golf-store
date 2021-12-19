import { NextFunction, Request, Response } from "express";
import Employee from "../../models/employeeModel";
import { TokenValidateBase, HeaderExtract } from "../auth/AuthenticateBase";
import ProductController from "./ProductController";

export default class ProductProtect extends ProductController {
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

      const employee = await Employee.findById(employeeId);
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
