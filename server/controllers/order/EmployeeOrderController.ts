import OrderController from "./OrderController";
import {Methods} from "../../typings/Controller";
import OrderRepository from "../../repositories/OrderRepository";
import {Request, Response, NextFunction} from "express";
import UserOrderController from "./UserOrderController";
import {StateManager} from "./states/StateManager";

export default class EmployeeOrderController extends UserOrderController{
    public path = "";
    readonly routes = [
        {
          path: "/auth/all",
          method: Methods.GET,
          handler: this.getAllOrder,
          localMiddlewares: [],
        },
        {
          path: "/auth/confirm/:id",
          method: Methods.PUT,
          handler: this.confirmOrder,
          localMiddlewares: [],
        },
        {
          path: "/auth/ship/:id",
          method: Methods.PUT,
          handler: this.shipOrder,
          localMiddlewares: [],
        },
        {
          path: "/auth/complete/:id",
          method: Methods.PUT,
          handler: this.completeOrder,
          localMiddlewares: [],
        },
        {
          path: "/auth/cancel/:id",
          method: Methods.PUT,
          handler: this.cancelOrder,
          localMiddlewares: [],
        },
    ];

    async getAllOrder(_: Request, res: Response, __: NextFunction): Promise<any> {
      try {
        const orders = await OrderRepository.getInstance().all({
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

    async confirmOrder(
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

    async shipOrder(req: Request, res: Response, _: NextFunction): Promise<any> {
      try {
        const { id } = req.params;
        const exist = await OrderRepository.getInstance().findById(id);

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
        const exist = await OrderRepository.getInstance().findById(id);

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

}