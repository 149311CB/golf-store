import { NextFunction, Request, Response } from "express";
import CartRepository from "../../repositories/CatRepository";
import OrderRepository from "../../repositories/OrderRepository";
import Controller from "../../typings/Controller";
import { orderInterface } from "../../types/orderType";
import { StateManager } from "./OrderState";

export default class OrderController extends Controller {
  public path = "";
  public routes = []

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

      const createOrder = await OrderRepository.getInstace().create(
        neworder as orderInterface
      );

      const exist = await CartRepository.getInstance().findById(cart);
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
      const exist = await OrderRepository.getInstace().findById(id);

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
      const exist = await OrderRepository.getInstace().findById(id);

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
      const exist = await OrderRepository.getInstace().findById(id);

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
      const exist = await OrderRepository.getInstace().findById(id);

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
  }

  async getAllOrder(_: Request, res: Response, __: NextFunction): Promise<any> {
    try {
      const orders = await OrderRepository.getInstace().all({
        path: "cart",
        select: "products",
        populate: { path: "products.product" },
      });

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
    if (!id) {
      return super.sendError(400, res, "id is required");
    }
    try {
      const order = await OrderRepository.getInstace().findById(id as string, {
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
