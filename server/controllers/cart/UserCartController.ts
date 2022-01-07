import { Request, Response, NextFunction } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import CartRepository from "../../repositories/CatRepository";
import { VariantRepository } from "../../repositories/GolfRepository";
import { CartController } from "./CartController";

export default class UserCartController extends CartController {
  public path = "";
  public routes = [];

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
      const existItem = exist.products.find((item: any) => {
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
        exist.products.push({ ...product });
      }

      const cart = await exist.save();

      res.status(201).json({ cart });
    } else {
      const cart = await CartRepository.getInstance().create({
        user: userId,
        products: [product],
        isActive: true,
      });

      res.status(201).json(cart);
    }
  }

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

  async countItem(
    req: Request<ParamsDictionary, any, any, ParsedQs>,
    res: Response,
    _: NextFunction
  ): Promise<any> {
    const { userId } = req;
    console.log(userId)
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
