import { IRoute, Methods } from "../../typings/Controller";
import { NextFunction, Request, Response } from "express";
import CartRepository from "../../repositories/CatRepository";
import { VariantRepository } from "../../repositories/GolfRepository";
import {
  COOKIES_OPTIONS,
  generateRefreshToken,
} from "../../utils/generateToken";
import { CartController } from "./CartController";

// @access: guest
export default class PublicCartController extends CartController {
  public path = "";
  public routes: IRoute[] = [
    {
      path: "/active",
      method: Methods.GET,
      handler: this.getActiveCart,
      localMiddlewares: [],
    },
    {
      path: "/add",
      method: Methods.POST,
      handler: this.addToCart,
      localMiddlewares: [],
    },
    {
      path: "/remove",
      method: Methods.POST,
      handler: this.removeProduct,
      localMiddlewares: [],
    },
    {
      path: "/quantity/update",
      method: Methods.POST,
      handler: this.updateQty,
      localMiddlewares: [],
    },
    {
      path: "/count",
      method: Methods.GET,
      handler: this.countItem,
      localMiddlewares: [],
    },
  ];

  async getActiveCart(
    req: Request,
    res: Response,
    _: NextFunction
  ): Promise<any> {
    try {
      const { cartId } = req;
      const exist = await CartRepository.getInstance().findById(cartId, {
        path: "products.variant products.product",
        populate: { path: "hand loft flex shaft" },
      });

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
    } catch (error) {
      console.log(error);
      super.sendError(500, res);
    }
  }

  async addToCart(req: Request, res: Response, _: NextFunction): Promise<any> {
    try {
      const { cartId } = req;

      const cart = await CartRepository.getInstance().findOne({
        _id: cartId,
        isActive: true,
      });

      const { product } = req.body;
      if (cart) {
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
          cart.products.push({ ...product });
        }

        await cart.save();
        super.sendSuccess(200, res, null);
      } else {
        const cart = await CartRepository.getInstance().create({
          user: null,
          products: [product],
          isActive: true,
        });
        const cartToken = generateRefreshToken({ cartId: cart._id });
        res.cookie("cart_token", cartToken, COOKIES_OPTIONS);
        return super.sendSuccess(200, res, null);
      }
    } catch (error) {
      console.log(error);
      return super.sendError(500, res);
    }
  }

  async removeProduct(
    req: Request,
    res: Response,
    _: NextFunction
  ): Promise<any> {
    const { cartId } = req;
    const { productId } = req.body;
    const exist = await CartRepository.getInstance().findById(cartId, {
      path: "products.variant products.product",
    });

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

  async updateQty(req: Request, res: Response, _: NextFunction): Promise<any> {
    const { cartId } = req;
    const { lineItemId, quantity } = req.body;
    if (!lineItemId || !quantity) {
      return super.sendError(400, res, "required line item id and quantity");
    }
    try {
      const cart = await CartRepository.getInstance().findById(cartId);
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
    } catch (error) {
      console.log(error);
      return super.sendError(500, res);
    }
  }

  async countItem(req: Request, res: Response, _: NextFunction): Promise<any> {
    const { cartId } = req;
    const cart = await CartRepository.getInstance().findById(cartId);
    if (!cart) {
      return super.sendSuccess(200, res, { count: 0 });
    }
    return super.sendSuccess(200, res, { count: cart.products.length });
  }
}

