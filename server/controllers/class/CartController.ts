import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import Cart from "../../models/cartModel";
import User from "../../models/userModel";
import Controller, { Methods } from "../../typings/Controller";
import { jwtValidate } from "./UserController";

export default class CartController extends Controller {
  public path = "/api/carts";
  protected routes = [
    {
      path: "/auth/active",
      method: Methods.GET,
      handler: this.getActiveCart,
      localMiddlewares: [jwtValidate],
    },
    {
      path: "/auth/add",
      method: Methods.POST,
      handler: this.authAddToCart,
      localMiddlewares: [jwtValidate],
    },
    {
      path: "/add",
      method: Methods.POST,
      handler: this.addToCart,
      localMiddlewares: [jwtValidate],
    },
    {
      path: "/auth/remove",
      method: Methods.POST,
      handler: this.removeProduct,
      localMiddlewares: [jwtValidate],
    },
    {
      path: "/auth/quantity/update",
      method: Methods.POST,
      handler: this.updateQty,
      localMiddlewares: [jwtValidate],
    },
    {
      path: "/auth/count",
      method: Methods.GET,
      handler: this.countItem,
      localMiddlewares: [jwtValidate],
    },
  ];

  constructor() {
    super();
  }

  async getActiveCart(
    req: Request,
    res: Response,
    _: NextFunction
  ): Promise<void> {
    try {
      const { user } = req;
      if (!user) {
        super.sendError(401, res, "UnAuthorized");
      }
      if (user) {
        // return 404
      }
      const exist = await Cart.findOne({
        isActive: true,
        user: user._id,
      }).populate({
        path: "products.variant products.product",
        populate: { path: "hand loft flex shaft" },
      });

      if (!exist) {
        super.sendSuccess(200, res, null, "not found");
        // return res.status(404).json({ message: "not found" });
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

  async authAddToCart(
    req: Request,
    res: Response,
    _: NextFunction
  ): Promise<void> {
    const { user } = req;
    const { product } = req.body;
    try {
      let exist;
      if (user) {
        exist = await Cart.findOne({
          user: user._id,
          isActive: true,
        });
      }

      if (exist) {
        const existItem = exist.products.find((item: any) => {
          return item.variant == product.variant;
        });

        if (existItem) {
          existItem.quantity = existItem.quantity + product.quantity;
        } else {
          exist.products.push({ ...product });
        }

        const cart = await exist.save();

        res.status(201).json({ cart });
      } else {
        const newCart = new Cart({
          user: user._id,
          products: [product],
          isActive: true,
        });

        const cart = await newCart.save();
        res.status(201).json(cart);
      }
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }

  async addToCart(req: Request, res: Response, _: NextFunction): Promise<any> {
    const { signedCookies = {} } = req;
    const { cart_token: cartToken } = signedCookies;
    if (!cartToken) {
      return super.sendError(401, res, "UnAuthorized");
    }
    const payload = jwt.verify(cartToken, process.env.JWT_SECRET!);
    if (typeof payload === "string") {
      return super.sendError(401, res, "UnAuthorized, token failed");
    }

    const exist = await Cart.findOne({
      _id: payload.cartId,
      isActive: true,
    });

    const { product } = req.body;
    if (exist) {
      const existItem = exist.products.find((item: any) => {
        return item.variant == product.variant;
      });

      if (existItem) {
        existItem.quantity = existItem.quantity + product.quantity;
      } else {
        exist.products.push({ ...product });
      }

      const cart = await exist.save();
      super.sendSuccess(200, res, cart);
    } else {
      const newCart = new Cart({
        user: null,
        products: [product],
        isActive: true,
      });

      const cart = await newCart.save();
      res.status(201).json(cart);
    }
  }

  async removeProduct(
    req: Request,
    res: Response,
    _: NextFunction
  ): Promise<void> {
    const { user } = req;
    const { productId } = req.body;
    try {
      const exist = await Cart.findOne({
        user: user._id,
        isActive: true,
      }).populate({
        path: "products.variant products.product",
        populate: { path: "hand loft flex shaft" },
      });

      if (exist) {
        exist.products = exist.products.filter((product) => {
          if (product._id == productId) {
            return false;
          }
          return true;
        });

        const newCart = await exist.save();
        super.sendSuccess(200, res, newCart);
      } else {
        super.sendError(404, res, "cart not found");
      }
    } catch (error) {
      console.log(error);
      super.sendError(500, res);
    }
  }

  async updateQty(req: Request, res: Response, _: NextFunction): Promise<any> {
    const { user } = req;
    const { lineItemId, quantity } = req.body;
    if (!lineItemId || !quantity) {
      return super.sendError(400, res, "required line item id and quantity");
    }
    try {
      const cart = await Cart.findOne({ user: user._id, isActive: true });
      if (!cart) {
        return super.sendError(404, res, "cart not found");
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
    const { user } = req;
    try {
      const cart = await Cart.findOne({ user: user._id, isActive: true });
      if (!cart) {
        return super.sendSuccess(200, res, { count: 0 }, "cart not found");
      }
      return super.sendSuccess(200, res, { count: cart.products.length });
    } catch (error) {
      console.log(error);
      return super.sendError(500, res);
    }
  }

}
