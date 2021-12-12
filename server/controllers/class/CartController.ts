import { NextFunction, Request, Response } from "express";
import Cart from "../../models/cartModel";
import Controller, { Methods } from "../../typings/Controller";

function authMiddleware(req: Request, _: Response, next: NextFunction) {
  req.user = {
    _id: "610844bf701a78827a321fa6",
    lastName: "",
    firstName: "",
    isActive: true,
    email: "",
    password: "",
    phoneNumber: "",
    emailVerification: false,
    refreshToken: "",
  };
  return next();
}

export default class CartController extends Controller {
  public path = "/api/carts/auth";
  protected routes = [
    {
      path: "/active",
      method: Methods.GET,
      handler: this.getActiveCart,
      localMiddlewares: [authMiddleware],
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
        super.sendError(404, res, "not found");
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
}
