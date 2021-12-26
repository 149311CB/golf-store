import { NextFunction, Request, Response } from "express";
import Cart from "../models/cartModel";
import Order from "../models/orderModel";
import Controller, { Methods } from "../typings/Controller";
import { orderInterface } from "../types/orderType";
import { StateManager } from "./order/OrderState";

export default class OrderController extends Controller {
  public path = "/api/order";
  protected routes = [
    {
      path: "/auth/create",
      method: Methods.POST,
      handler: this.createOrder.bind(this),
      localMiddlewares: [],
    },
    {
      path: "/auth/all",
      method: Methods.GET,
      handler: this.getAllOrder.bind(this),
      localMiddlewares: [],
    },
    {
      path: "/auth/details/:id",
      method: Methods.GET,
      handler: this.getOrderById.bind(this),
      localMiddlewares: [],
    },
    {
      path: "/auth/confirm/:id",
      method: Methods.PUT,
      handler: this.confirmOrder.bind(this),
      localMiddlewares: [],
    },
    {
      path: "/auth/ship/:id",
      method: Methods.PUT,
      handler: this.shipOrder.bind(this),
      localMiddlewares: [],
    },
    {
      path: "/auth/complete/:id",
      method: Methods.PUT,
      handler: this.completeOrder.bind(this),
      localMiddlewares: [],
    },
    {
      path: "/auth/cancel/:id",
      method: Methods.PUT,
      handler: this.cancelOrder.bind(this),
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
    try {
      const neworder = {
        cart: cart,
        state: { state },
        paymentMethod: {
          method: paymentMethod,
          details: details,
        },
        stateHistory: [{ state }],
        paidAt: paidAt,
        cancelledAt: cancelledAt,
      };

      const createOrder = await Order.getInstace().create(
        neworder as orderInterface
      );

      const exist = await Cart.findById({ _id: cart });
      if (exist) {
        exist.isActive = false;
        await exist.save();
      }

      return res.status(201).json(createOrder);
    } catch (error) {
      console.log(error);
      return res.status(500);
    }
  }

  async confirmOrder(
    req: Request,
    res: Response,
    _: NextFunction
  ): Promise<any> {
    try {
      const { id } = req.params;
      const exist = await Order.getInstace().findById(id);

      if (!exist) {
        return super.sendError(401, res, "order not found");
      }

      try {
        const stateManager = new StateManager(exist);
        stateManager.confirmOrder();
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

  async cancelOrder(
    req: Request,
    res: Response,
    _: NextFunction
  ): Promise<any> {
    try {
      const { id } = req.params;
      const exist = await Order.getInstace().findById(id);

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

  async shipOrder(req: Request, res: Response, _: NextFunction): Promise<any> {
    try {
      const { id } = req.params;
      const exist = await Order.getInstace().findById(id);

      if (!exist) {
        return super.sendError(401, res, "order not found");
      }

      try {
        const stateManager = new StateManager(exist);
        stateManager.shipOrder();
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

  async completeOrder(
    req: Request,
    res: Response,
    _: NextFunction
  ): Promise<any> {
    try {
      const { id } = req.params;
      const exist = await Order.getInstace().findById(id);

      if (!exist) {
        return super.sendError(401, res, "order not found");
      }

      try {
        const stateManager = new StateManager(exist);
        stateManager.completeOrder();
        return super.sendSuccess(200, res, null);
      } catch (error) {
        console.log(error);
        return super.sendError(400, res, "Invalid operation");
      }
    } catch (error) {
      console.log(error);
      return super.sendError(500, res);
    }
    // try {
    //   const { orderId } = req.body;
    //   const exist = await Order.getInstace().findById(orderId);
    //   if (!exist) {
    //     return super.sendError(401, res, "order not found");
    //   }
    //   if (exist.state === "shipped") {
    //     exist.state = "completed";
    //     exist.stateHistory = [...exist.stateHistory, { state: "completed" }];
    //     await Order.getInstace().updateInfo(exist);

    //     return super.sendSuccess(200, res, null, "order cancelled");
    //   } else {
    //     return super.sendError(400, res, "order state not valid");
    //   }
    // } catch (error) {
    //   console.log(error);
    //   return super.sendError(500, res);
    // }
  }

  async getAllOrder(_: Request, res: Response, __: NextFunction): Promise<any> {
    try {
      const orders = await Order.getInstace().find(
        {},
        {
          path: "cart",
          select: "products",
          populate: { path: "products.product" },
        }
      );

      return super.sendSuccess(200, res, orders);
    } catch (error) {
      console.log(error);
      return super.sendError(500, res);
    }
  }

  async getOrderById(
    req: Request,
    res: Response,
    __: NextFunction
  ): Promise<any> {
    const { id } = req.params;
    if (!id || typeof id !== "string") {
      return super.sendError(400, res, "id is required");
    }
    try {
      const order = await Order.getInstace().findById(id as string, {
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
