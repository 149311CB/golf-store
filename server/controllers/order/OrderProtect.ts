import { NextFunction, Request, Response } from "express";
import EmployeeRepository from "../../repositories/employeeModel";
import { EmployeeTypes } from "../../types/userTypes";
import { HeaderExtract, TokenValidateBase } from "../auth/AuthenticateBase";
import OrderController from "./OrderController";

export default class OrderProtect extends OrderController {
  constructor(){
    super()
    this.getEmployeeInfo = this.getEmployeeInfo.bind(this)
    this.getAllOrder = this.getAllOrder.bind(this)
    this.checkWritePermission = this.checkWritePermission.bind(this)
    this.confirmOrder = this.confirmOrder.bind(this)
  }
  async getEmployeeInfo(
    req: Request,
    res: Response
  ): Promise<EmployeeTypes | null> {
    // validate bearer token
    const service = new TokenValidateBase(
      new HeaderExtract(),
      process.env.JWT_SECRET!
    );

    const { employeeId } = service.validateToken(req, res);

    const exist = await EmployeeRepository.getInstance().findById(employeeId, {
      path: "role",
      populate: { path: "permission" },
    });
    return exist;
  }

  async getAllOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const exist = await this.getEmployeeInfo(req, res);
      if (exist) {
        const result = exist.role.permissions.find((permission) => {
          return (
            (permission.resource === "order" ||
              permission.resource === "all") &&
            permission.read === true
          );
        });
        if (!result) {
          return super.sendError(401, res, "UnAuthorized");
        }
        req.user = exist;

        return super.getAllOrder(req, res, next);
      }
    } catch (error) {
      console.log(error);
      return super.sendError(500, res, "UnAuthorized");
    }
  }

  checkWritePermission(employee: EmployeeTypes) {
    return employee.role.permissions.find((permission) => {
      return (
        (permission.resource === "order" || permission.resource === "all") &&
        permission.write === true
      );
    });
  }

  async confirmOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const exist = await this.getEmployeeInfo(req, res);
      if (exist) {
        const result = this.checkWritePermission(exist);
        if (!result) {
          return super.sendError(401, res, "UnAuthorized");
        }
        req.user = exist;
        return super.confirmOrder(req, res, next);
      }
    } catch (error) {
      console.log(error);
      return super.sendError(500, res, "UnAuthorized");
    }
  }
}
