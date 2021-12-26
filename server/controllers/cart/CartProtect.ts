import { NextFunction, Request, Response } from "express";
import { CookieExtraction, TokenValidateBase } from "../auth/AuthenticateBase";
import CartController from "./CartController";

export default class CartProtect extends CartController {
  async getCartInforFromCookie(req: Request, res: Response): Promise<any> {
    const cookieExtraction = new CookieExtraction("cart_token");
    const service = new TokenValidateBase(
      cookieExtraction,
      process.env.REFRESH_TOKEN_SECRET!,
      true
    );
    const { cartId } = service.validateToken(req, res);
    return cartId;
  }
  async addToCart(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      req.cartId = await this.getCartInforFromCookie(req, res);
      return super.addToCart(req, res, next);
    } catch (error) {
      console.log(error);
      return super.sendError(500, res);
    }
  }

  // async authUpdateQty(
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ): Promise<any> {
  // }

  async updateQty(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      req.cartId = await this.getCartInforFromCookie(req, res);
      return super.updateQty(req, res, next);
    } catch (error) {
      console.log(error);
      return super.sendError(500, res);
    }
  }

  async removeProduct(req:Request,res:Response,next:NextFunction):Promise<any>{
    try {
      req.cartId = await this.getCartInforFromCookie(req, res);
      return super.removeProduct(req, res, next);
    } catch (error) {
      console.log(error);
      return super.sendError(500, res);
    }
  }

  async getActiveCart(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      req.cartId = await this.getCartInforFromCookie(req, res);
      return super.getActiveCart(req, res, next);
    } catch (error) {
      console.log(error);
      return super.sendError(500, res);
    }
  }
}
