import { Request, Response, NextFunction } from "express";
import EmployeeRepository from "../../../repositories/employeeModel";
import { EmployeeTypes } from "../../../types/userTypes";
import ConfigureLogging from "../../../utils/logger/ConfigureLogging";
import { HeaderExtract, TokenValidateBase } from "../../auth/AuthenticateBase";
import { TokenValidateDecorator } from "../../auth/AuthenticateDecorator";
import EmployeeOrderController from "../EmployeeOrderController";

export default class EmployeeOrderProtect extends EmployeeOrderController {
  constructor(logger: ConfigureLogging) {
    super(logger);
    this.getEmployeeInfo = this.getEmployeeInfo.bind(this);
    this.checkWritePermission = this.checkWritePermission.bind(this);
    this.checkReadPermission = this.checkReadPermission.bind(this);
    this.getAllOrder = this.getAllOrder.bind(this);
    this.getOrderById = this.getOrderById.bind(this);
    this.confirmOrder = this.confirmOrder.bind(this);
  }

  async getEmployeeInfo(
    req: Request,
    res: Response
  ): Promise<EmployeeTypes | null> {
    // validate bearer token
    const service = new TokenValidateDecorator(
      new TokenValidateBase(new HeaderExtract(), process.env.JWT_SECRET!),
      this.logger
    );

    const { employeeId } = await service.validateToken(req, res);

    return await EmployeeRepository.getInstance().findById(employeeId, {
      path: "role",
      populate: { path: "permission" },
    });
  }

  checkWritePermission(employee: EmployeeTypes) {
    return employee.role.permissions.find((permission) => {
      return (
        (permission.resource === "order" || permission.resource === "all") &&
        permission.write === true
      );
    });
  }

  checkReadPermission(employee: EmployeeTypes) {
    return employee.role.permissions.find((permission) => {
      return (
        (permission.resource === "order" || permission.resource === "all") &&
        permission.read === true
      );
    });
  }

  async getAllOrder(req: Request, res: Response, next: NextFunction) {
    const exist = await super.getEmployeeInfo(req, res);
    if (exist) {
      const result = this.checkReadPermission(exist);
      if (!result) {
        return super.sendError(401, res, "UnAuthorized");
      }
      req.user = exist;

      return super.getAllOrder(req, res, next);
    }
  }

  async getOrderById(req: Request, res: Response, next: NextFunction) {
    const exist = await super.getEmployeeInfo(req, res);
    if (exist) {
      const result = this.checkReadPermission(exist);
      if (!result) {
        return super.sendError(401, res, "UnAuthorized");
      }
      req.user = exist;

      return super.getOrderById(req, res, next);
    }
  }

  async confirmOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const exist = await super.getEmployeeInfo(req, res);
      if (exist) {
        const result = super.checkWritePermission(exist);
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
