import {NextFunction, Request, Response} from "express";
import Controller from "../../typings/Controller";
import {CookieExtraction, HeaderExtract, TokenValidateBase,} from "../auth/AuthenticateBase";
import {TokenValidateDecorator} from "../auth/AuthenticateDecorator";
import ConfigureLogging from "../../utils/logger/ConfigureLogging";
import {ICartInterface} from "../../types/cartType";
import {Document} from "mongoose";
import {VariantRepository} from "../../repositories/GolfRepository";

export abstract class CartController extends Controller {
  public path= "/api/carts"
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

  protected async add(cart: ICartInterface & Document<any, any, ICartInterface>, product: any, res: Response) {
    const existItem = cart.products.find((item: any) => {
      return item.variant == product.variant;
    });
    const variant = await VariantRepository.getInstance().findById(
        product.variant
    );
    if (existItem) {
      if (variant.stock < existItem.quantity + product.quantity) {
        return super.sendError(400, res, "quantity exceeded");
      }
      existItem.quantity = existItem.quantity + product.quantity;
    } else {
      if (variant.stock < product.quantity) {
        return super.sendError(400, res, "quantity exceeded");
      }
      cart.products.push({...product});
    }

    await cart.save();
    super.sendSuccess(200, res, null);
  }

  protected async updateQuantity(cart: ICartInterface & Document<any, any, ICartInterface>, res: Response, lineItemId: string, quantity: number) {
    if (!cart) {
      return super.sendError(404, res, "cart-badge not found");
    }

    const updateItem = cart.products.find((item: any) => {
      return item._id == lineItemId;
    });
    if (!updateItem) {
      return super.sendError(404, res, "item not found");
    }
    updateItem.quantity = quantity;
    await cart.save();
    return super.sendSuccess(200, res, null);
  }
}
