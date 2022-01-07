import { NextFunction, Request, Response } from "express";
import ConfigureLogging from "../../../utils/logger/ConfigureLogging";
import UserCartController from "../UserCartController";

export default class UserCartProtect extends UserCartController {
  constructor(logger: ConfigureLogging) {
    super(logger);
  }

  async getActiveCart(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    req.userId = await super.getUserFromHeader(req, res);
    await super.getActiveCart(req, res, next);
  }

  async addToCart(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    req.userId = await super.getUserFromHeader(req, res);
    await super.addToCart(req, res, next);
  }

  async updateQty(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    req.userId = await super.getUserFromHeader(req, res);
    await super.updateQty(req, res, next);
  }

  async removeProduct(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    req.userId = await super.getUserFromHeader(req, res);
    await super.removeProduct(req, res, next);
  }

  async countItem(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    req.userId = await super.getUserFromHeader(req, res);
    await super.countItem(req, res, next);
  }
}
