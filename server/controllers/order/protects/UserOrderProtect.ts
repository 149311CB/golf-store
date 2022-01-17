import { Request, Response, NextFunction } from "express";
import UserRepository from "../../../repositories/UserRepository";
import ConfigureLogging from "../../../utils/logger/ConfigureLogging";
import { HeaderExtract, TokenValidateBase } from "../../auth/AuthenticateBase";
import { TokenValidateDecorator } from "../../auth/AuthenticateDecorator";
import UserOrderController from "../UserOrderController";

export default class UserOrderProtect extends UserOrderController {
  logger:ConfigureLogging
  constructor(logger:ConfigureLogging){
    super(logger)
    this.logger = logger
    this.getUserInfo = this.getUserInfo.bind(this)
    this.getAllOrder = this.getAllOrder.bind(this)
    this.createOrder = this.createOrder.bind(this)
  }

  async getUserInfo(req: Request, res: Response) {
    const service = new TokenValidateDecorator(
      new TokenValidateBase(new HeaderExtract(), process.env.JWT_SECRET!),
      this.logger
    );
    const { userId } =await service.validateToken(req, res);
    return await UserRepository.getInstance().findById(userId);
  }

  async createOrder(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    const exist = await this.getUserInfo(req, res);
    req.user = exist;
    return super.createOrder(req, res, next);
  }

  async getAllOrder(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    const exist = await this.getUserInfo(req, res);
    req.user = exist;
    return super.getAllOrder(req, res, next);
  }
}
