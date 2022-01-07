import { Request, Response, NextFunction } from "express";
import Controller from "../../typings/Controller";
import {
  CookieExtraction,
  HeaderExtract,
  TokenValidateBase,
} from "../auth/AuthenticateBase";
import { TokenValidateDecorator } from "../auth/AuthenticateDecorator";
import ConfigureLogging from "../../utils/logger/ConfigureLogging";

export abstract class CartController extends Controller {
  logger: ConfigureLogging;

  constructor(logger: ConfigureLogging) {
    super();
    this.logger = logger;
  }

  async getCartInfoFromCookie(req: Request, res: Response): Promise<any> {
    const cookieExtraction = new CookieExtraction("cart_token");
    const service = new TokenValidateDecorator(
      new TokenValidateBase(
        cookieExtraction,
        process.env.REFRESH_TOKEN_SECRET!,
        true
      ),
      this.logger
    );
    const { cartId } = await service.validateToken(req, res);
    return cartId;
  }

  async getUserFromHeader(req: Request, res: Response): Promise<any> {
    const headerExtraction = new HeaderExtract();
    const service = new TokenValidateDecorator(
      new TokenValidateBase(headerExtraction, process.env.JWT_SECRET!),
      this.logger
    );
    const { userId } = await service.validateToken(req, res);
    return userId;
  }

  abstract getActiveCart(
    req: Request,
    res: Response,
    _: NextFunction
  ): Promise<any>;

  abstract addToCart(
    req: Request,
    res: Response,
    _: NextFunction
  ): Promise<any>;

  abstract removeProduct(
    req: Request,
    res: Response,
    _: NextFunction
  ): Promise<any>;

  abstract updateQty(
    req: Request,
    res: Response,
    _: NextFunction
  ): Promise<any>;

  abstract countItem(
    req: Request,
    res: Response,
    _: NextFunction
  ): Promise<any>;
}
