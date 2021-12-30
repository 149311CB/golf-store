import { NextFunction, Request, Response } from "express";
import Cart from "../../models/cartModel";
import Controller, { Methods } from "../../typings/Controller";
import { jwtValidate } from "../../middlewares/authMiddleware";
import {
  COOKIES_OPTIONS,
  generateRefreshToken,
} from "../../utils/generateToken";

export default class CartController extends Controller {
  public path = "/api/carts";
  public routes = [
    {
      path: "/auth/active",
      method: Methods.GET,
      handler: this.authGetActiveCart.bind(this),
      localMiddlewares: [jwtValidate],
    },
    {
      path: "/active",
      method: Methods.GET,
      handler: this.getActiveCart.bind(this),
      localMiddlewares: [],
    },
    {
      path: "/auth/add",
      method: Methods.POST,
      handler: this.authAddToCart.bind(this),
      localMiddlewares: [jwtValidate],
    },
    {
      path: "/add",
      method: Methods.POST,
      handler: this.addToCart.bind(this),
      localMiddlewares: [],
    },
    {
      path: "/auth/remove",
      method: Methods.POST,
      handler: this.authRemoveProduct.bind(this),
      localMiddlewares: [jwtValidate],
    },
    {
      path: "/remove",
      method: Methods.POST,
      handler: this.removeProduct.bind(this),
      localMiddlewares: [],
    },
    {
      path: "/auth/quantity/update",
      method: Methods.POST,
      handler: this.authUpdateQty.bind(this),
      localMiddlewares: [jwtValidate],
    },
    {
      path: "/quantity/update",
      method: Methods.POST,
      handler: this.updateQty.bind(this),
      localMiddlewares: [],
    },

    {
      path: "/auth/count",
      method: Methods.GET,
      handler: this.countItem.bind(this),
      localMiddlewares: [jwtValidate],
    },
  ];

  constructor() {
    super();
  }

  async authGetActiveCart(
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
      const exist = await Cart.getInstance().findOne(
        {
          isActive: true,
          user: user._id,
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
    } catch (error) {
      console.log(error);
      super.sendError(500, res);
    }
  }

  async getActiveCart(
    req: Request,
    res: Response,
    _: NextFunction
  ): Promise<any> {
    try {
      const { cartId } = req;
      const exist = await Cart.getInstance().findById(cartId, {
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
        exist = await Cart.getInstance().findOne({
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
        const cart = await Cart.getInstance().create({
          user: user._id,
          products: [product],
          isActive: true,
        });

        res.status(201).json(cart);
      }
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }

  async addToCart(req: Request, res: Response, _: NextFunction): Promise<any> {
    try {
      const { cartId } = req;

      const cart = await Cart.getInstance().findOne({
        _id: cartId,
        isActive: true,
      });
      const { product } = req.body;
      if (cart) {
        const existItem = cart.products.find((item: any) => {
          return item.variant == product.variant;
        });

        if (existItem) {
          existItem.quantity = existItem.quantity + product.quantity;
        } else {
          cart.products.push({ ...product });
        }

        await cart.save();
        super.sendSuccess(200, res, null);
      } else {
        // const cart = await newCart.save();
        const cart = await Cart.getInstance().create({
          user: null,
          products: [product],
          isActive: true,
        });
        const cartToken = generateRefreshToken({ cartId: cart._id });
        res.cookie("cart_token", cartToken, COOKIES_OPTIONS);
        return super.sendSuccess(200, res, null);
        // res.status(201).json(cart);
      }
    } catch (error) {
      console.log(error);
      return super.sendError(500, res);
    }
  }

  async authRemoveProduct(
    req: Request,
    res: Response,
    _: NextFunction
  ): Promise<void> {
    const { user } = req;
    const { productId } = req.body;
    try {
      const exist = await Cart.getInstance().findOne(
        {
          user: user._id,
          isActive: true,
        },
        {
          path: "products.variant products.product",
          populate: { path: "hand loft flex shaft" },
        }
      );

      if (exist) {
        exist.products = exist.products.filter((product) => {
          return product._id != productId;
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

  async removeProduct(
    req: Request,
    res: Response,
    _: NextFunction
  ): Promise<any> {
    const { cartId } = req;
    const { productId } = req.body;
    try {
      const exist = await Cart.getInstance().findById(cartId, {
        path: "products.variant products.product",
        populate: { path: "hand loft flex shaft" },
      });

      if (exist) {
        exist.products = exist.products.filter((product) => {
          return product._id != productId;
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

  async authUpdateQty(
    req: Request,
    res: Response,
    _: NextFunction
  ): Promise<any> {
    const { user } = req;
    const { lineItemId, quantity } = req.body;
    if (!lineItemId || !quantity) {
      return super.sendError(400, res, "required line item id and quantity");
    }
    try {
      const cart = await Cart.getInstance().findOne({ user: user._id, isActive: true });
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

  async updateQty(req: Request, res: Response, _: NextFunction): Promise<any> {
    const { cartId } = req;
    const { lineItemId, quantity } = req.body;
    if (!lineItemId || !quantity) {
      return super.sendError(400, res, "required line item id and quantity");
    }
    try {
      const cart = await Cart.getInstance().findById(cartId);
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
      const cart = await Cart.getInstance().findOne({ user: user._id, isActive: true });
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
