import { NextFunction, Request, Response } from "express";
import CartRepository from "../../repositories/CatRepository";
import OrderRepository from "../../repositories/OrderRepository";
import { orderInterface } from "../../types/orderType";
import { VariantRepository } from "../../repositories/GolfRepository";
import OrderController from "./OrderController";
import { Methods } from "../../typings/Controller";

export default class UserOrderController extends OrderController {
  public path = "";
  public routes = [
    {
      path: "/auth/create",
      method: Methods.POST,
      handler: this.createOrder,
      localMiddlewares: [],
    },
    {
      path: "/auth/details/:id",
      method: Methods.GET,
      handler: this.getOrderById,
      localMiddlewares: [],
    },
  ];

  async createOrder(
    req: Request,
    res: Response,
    _: NextFunction
  ): Promise<any> {
    const { cart, state, paymentMethod, details, paidAt, cancelledAt } =
      req.body;
    let orderState = "pending";
    if (state === "cancelled") {
      orderState = "cancelled";
    }
    try {
      const newOrder = {
        cart: cart,
        state: { state: orderState },
        paymentMethod: {
          method: paymentMethod,
          details: details,
        },
        stateHistory: [{ state: orderState }],
        paidAt: paidAt,
        cancelledAt: cancelledAt,
      };

      const createOrder = await OrderRepository.getInstance().create(
        newOrder as orderInterface
      );

      const exist = await CartRepository.getInstance().findById(cart);
      if (exist) {
        exist.isActive = false;
        await exist.save();
        if (createOrder?.state.state === "succeeded") {
          // reduce stock by subtract stock for product's quantity
          for (let index = 0; index < exist.products.length; index++) {
            const product = exist.products[index];
            const variant = await VariantRepository.getInstance().findById(
              product.variant
            );
            variant.stock -= product.quantity;
            await VariantRepository.getInstance().updateInfo(variant);
          }
        }
      }

      return res.status(201).json(createOrder);
    } catch (error) {
      console.log(error);
      return res.status(500);
    }
  }

  async getOrderById(
    req: Request,
    res: Response,
    __: NextFunction
  ): Promise<any> {
    const { id } = req.params;
    if (!id) {
      return super.sendError(400, res, "id is required");
    }
    try {
      const order = await OrderRepository.getInstance().findById(id as string, {
        path: "cart",
        select: "products",
        populate: {
          path: "products.product products.variant",
          populate: { path: "flex hand loft shaft" },
        },
      });

      if (!order) {
        return super.sendError(404, res, "Order not found");
      }
      return super.sendSuccess(200, res, order);
    } catch (error) {
      console.log(error);
      return super.sendError(500, res);
    }
  }
}
