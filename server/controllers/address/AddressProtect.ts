import { NextFunction, Request, Response } from "express";
import UserRepository from "../../repositories/UserRepository";
import ConfigureLogging from "../../utils/logger/ConfigureLogging";
import { HeaderExtract, TokenValidateBase } from "../auth/AuthenticateBase";
import { TokenValidateDecorator } from "../auth/AuthenticateDecorator";
import AddressController from "./AddressController";

export default class AddressProtect extends AddressController {
  logger: ConfigureLogging;
  constructor(logger: ConfigureLogging) {
    super();
    this.logger = logger;
    this.getUserInfo = this.getUserInfo.bind(this);
    this.createAddress = this.createAddress.bind(this);
  }
  async getUserInfo(req: Request, res: Response) {
    const service = new TokenValidateDecorator(
      new TokenValidateBase(new HeaderExtract(), process.env.JWT_SECRET!),
      this.logger
    );
    const { userId } = await service.validateToken(req, res);
    return await UserRepository.getInstance().findById(userId);
  }
  async createAddress(req: Request, res: Response, next: NextFunction) {
    const user = await this.getUserInfo(req, res);
    req.user = user;
    super.createAddress(req, res, next);
  }
  async getPrimaryAddress(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const user = await this.getUserInfo(req, res);
      req.user = user;
      super.getPrimaryAddress(req, res, next);
    } catch (error) {}
  }
}
