import {NextFunction, Request, Response} from "express";
import EmployeeRepository from "../../repositories/employeeModel";
import {EmployeeTypes} from "../../types/userTypes";
import Controller from "../../typings/Controller";
import ConfigureLogging from "../../utils/logger/ConfigureLogging";
import {HeaderExtract, TokenValidateBase} from "../auth/AuthenticateBase";

export default abstract class OrderController extends Controller {
  logger: ConfigureLogging;
  constructor(logger: ConfigureLogging) {
    super();
    this.logger = logger;
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

    return await EmployeeRepository.getInstance().findById(employeeId, {
      path: "role",
      populate: {path: "permission"},
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

  abstract createOrder(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any>;
  abstract getOrderById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any>;
}
