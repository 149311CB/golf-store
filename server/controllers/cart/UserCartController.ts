import { Request, Response, NextFunction } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { userCartProtected } from "../../middlewares/authMiddleware";
import { requestLog } from "../../middlewares/requestLog";
import { routeConfig } from "../../middlewares/routeConfig";
import CartRepository from "../../repositories/CatRepository";
import { CartController } from "./CartController";

export default class UserCartController extends CartController {
  @requestLog()
  @routeConfig({ method: "get", path: "/api/carts" + "/auth/active", middlewares: [userCartProtected] })
  async getActiveCart(
    req: Request<ParamsDictionary, any, any, ParsedQs>,
    res: Response,
    _: NextFunction
  ): Promise<any> {
    const { userId } = req;
    const exist = await CartRepository.getInstance().findOne(
      {
        user: userId,
        isActive: true,
      },
      {
        path: "products.variant products.product",
        populate: { path: "hand loft flex shaft" },
      }
    );

    if (!exist) {
      super.sendSuccess(200, res, null, "not found");
    } else {
      const result = {
        _id: exist._id,
        products: exist.products,
        isActive: exist.isActive,
        user: exist.user,
      };
      super.sendSuccess(200, res, result);
    }
  }

  @requestLog()
  @routeConfig({ method: "post", path: "/api/carts" + "/auth/add", middlewares: [userCartProtected] })
  async addToCart(
    req: Request<ParamsDictionary, any, any, ParsedQs>,
    res: Response,
    _: NextFunction
  ): Promise<any> {
    const { userId } = req;
    const { product } = req.body;
    // find cart
    const exist = await CartRepository.getInstance().findOne({
      user: userId,
      isActive: true,
    });

    if (exist) {
      return await super.add(exist, product, res);
    } else {
      const cart = await CartRepository.getInstance().create({
        user: userId,
        products: [product],
        isActive: true,
      });

      res.status(201).json(cart);
    }
  }

  @requestLog()
  @routeConfig({ method: "post", path: "/api/carts" + "/auth/remove", middlewares: [userCartProtected] })
  async removeProduct(
    req: Request<ParamsDictionary, any, any, ParsedQs>,
    res: Response,
    _: NextFunction
  ): Promise<any> {
    const { userId } = req;
    const { productId } = req.body;
    const exist = await CartRepository.getInstance().findOne(
      {
        user: userId,
        isActive: true,
      },
      {
        path: "products.variant products.product",
      }
    );

    if (exist) {
      exist.products = exist.products.filter((product) => {
        return product._id != productId;
      });

      const newCart = await exist.save();
      super.sendSuccess(200, res, newCart);
    } else {
      super.sendError(404, res, "cart-badge not found");
    }
  }

  @requestLog()
  @routeConfig({ method: "get", path: "/api/carts" + "/auth/quantity/update", middlewares: [userCartProtected] })
  async updateQty(
    req: Request<ParamsDictionary, any, any, ParsedQs>,
    res: Response,
    _: NextFunction
  ): Promise<any> {
    const { userId } = req;
    const { lineItemId, quantity } = req.body;
    if (!lineItemId || !quantity) {
      return super.sendError(400, res, "required line item id and quantity");
    }
    const cart = await CartRepository.getInstance().findOne({
      user: userId,
      isActive: true,
    });

    return await this.updateQuantity(cart, res, lineItemId, quantity);
  }

  @requestLog()
  @routeConfig({ method: "get", path: "/api/carts" + "/auth/count", middlewares: [userCartProtected] })
  async countItem(
    req: Request<ParamsDictionary, any, any, ParsedQs>,
    res: Response,
    _: NextFunction
  ): Promise<any> {
    const { userId } = req;
    const cart = await CartRepository.getInstance().findOne({
      user: userId,
      isActive: true,
    });
    if (!cart) {
      return super.sendSuccess(200, res, { count: 0 });
    }
    return super.sendSuccess(200, res, { count: cart.products.length });
  }
}
