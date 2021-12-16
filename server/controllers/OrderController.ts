import { NextFunction, Request, Response } from "express";
import Cart from "../models/cartModel";
import Order from "../models/orderModel";
import Controller, { Methods } from "../typings/Controller";
import {jwtValidate} from "../middlewares/authMiddleware";

export default class OrderController extends Controller {
  public path = "/api/order";
  protected routes = [
    {
      path: "/auth/create",
      method: Methods.POST,
      handler: this.createOrder,
      localMiddlewares: [jwtValidate],
    },
  ];

  async createOrder(
    req: Request,
    res: Response,
    _: NextFunction
  ): Promise<any> {
    const { cart, state, paymentMethod, details, paidAt, cancelledAt } =
      req.body;
    try {
      const order = new Order({
        cart: cart,
        state: state,
        paymentMethod: {
          method: paymentMethod,
          details: details,
        },
        paidAt: paidAt,
        cancelledAt: cancelledAt,
      });

      const createOrder = await order.save();
      const exist = await Cart.findById({ _id: cart });
      if (exist) {
        exist.isActive = false;
        await exist.save();
      }
      return res.status(201).json(createOrder);
    } catch (error) {
      return res.status(500);
    }
  }
}
