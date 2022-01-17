import { NextFunction, Request, Response } from "express";
import CartRepository from "../../repositories/CatRepository";
import OrderRepository from "../../repositories/OrderRepository";
import { orderInterface } from "../../types/orderType";
import { VariantRepository } from "../../repositories/GolfRepository";
import OrderController from "./OrderController";
import { StateManager } from "./states/StateManager";

export default class UserOrderController extends OrderController {
  public path = "";
  public routes = [];

  async createOrder(
    req: Request,
    res: Response,
    _: NextFunction
  ): Promise<any> {
    const {
      cart,
      state,
      paymentMethod,
      details,
      paidAt,
      cancelledAt,
      shipping,
      total
    } = req.body;
    let orderState = "pending";
    if (state === "cancelled") {
      orderState = "cancelled";
    }
    const newOrder = {
      cart: cart,
      state: { state: orderState },
      paymentMethod: {
        method: paymentMethod,
        details: details,
      },
      stateHistory: [{ state: orderState }],
      paidAt,
      cancelledAt,
      shipping,
      total
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
  }

  async getAllOrder(
    req: Request,
    res: Response,
    __: NextFunction
  ): Promise<any> {
    try {
      const carts = await CartRepository.getInstance().all({
        user: req.user._id,
      });
      const cartIds = carts.map((cart) => {
        return cart._id;
      });
      const orders = await OrderRepository.getInstance().all(
        { cart: { $in: cartIds } },
        {
          path: "cart",
          select: "products",
          populate: { path: "products.product" },
        },
        {
          $natural: -1,
        },
        10
      );

      return super.sendSuccess(200, res, orders);
    } catch (error) {
      console.log(error);
      return super.sendError(500, res);
    }
  }

  async cancelOrder(
    req: Request,
    res: Response,
    _: NextFunction
  ): Promise<any> {
    try {
      const { id } = req.params;
      const exist = await OrderRepository.getInstance().findById(id);

      if (!exist) {
        return super.sendError(401, res, "order not found");
      }

      try {
        const stateManager = new StateManager(exist);
        stateManager.cancelOrder();
        return super.sendSuccess(200, res, null);
      } catch (error) {
        console.log(error);
        return super.sendError(400, res, "Invalid operation");
      }
    } catch (error) {
      console.log(error);
      return super.sendError(500, res);
    }
  }
}
