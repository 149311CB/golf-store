import { NextFunction, Request, Response } from "express";
import ConfigureLogging from "../../../utils/logger/ConfigureLogging";
import PublicCartController from "../PublicCartController";

export default class PublicCartProtect extends PublicCartController {
  constructor(logger: ConfigureLogging) {
    super(logger);
  }

  async getActiveCart(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    req.cartId = await super.getCartInfoFromCookie(req, res);
    return super.getActiveCart(req, res, next);
  }

  async addToCart(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    req.cartId = await super.getCartInfoFromCookie(req, res);
    return super.addToCart(req, res, next);
  }

  async updateQty(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    req.cartId = await super.getCartInfoFromCookie(req, res);
    return super.updateQty(req, res, next);
  }

  // async authRemoveProduct(req: Request, res: Response, next: NextFunction) {
  //   req.userId = await this.getUserFromHeader(req, res);
  //   // return super.authRemoveProduct(req, res, next);
  // }

  async removeProduct(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    req.cartId = await super.getCartInfoFromCookie(req, res);
    return super.removeProduct(req, res, next);
  }

  async countItem(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    req.cartId = await super.getCartInfoFromCookie(req, res);
    return super.countItem(req, res, next);
  }
}
