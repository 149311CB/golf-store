import { NextFunction, Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import EmployeeOrderController from "../../EmployeeOrderController";
import ConfigureLogging from "../../../../utils/logger/ConfigureLogging";
import { IRoute, Methods } from "../../../../typings/Controller";
import { OrderLoggingDecorator } from "./OrderLoggingDecorator";

export default class EmployeeOrderLoggingDecorator extends OrderLoggingDecorator {
  public routes: IRoute[] = [
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
  orderController: EmployeeOrderController;
  constructor(
    orderController: EmployeeOrderController,
    logger: ConfigureLogging
  ) {
    super(orderController, logger);
    this.orderController = orderController;
  }
  async confirmOrder(
    req: Request<ParamsDictionary, any, any, ParsedQs>,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    await this.requestHandler(
      req,
      res,
      next,
      this.orderController.confirmOrder
    );
  }
  async cancelOrder(
    req: Request<ParamsDictionary, any, any, ParsedQs>,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    await this.requestHandler(req, res, next, this.orderController.cancelOrder);
  }
  async shipOrder(
    req: Request<ParamsDictionary, any, any, ParsedQs>,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    await this.requestHandler(req, res, next, this.orderController.shipOrder);
  }
  async completeOrder(
    req: Request<ParamsDictionary, any, any, ParsedQs>,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    await this.requestHandler(
      req,
      res,
      next,
      this.orderController.completeOrder
    );
  }
  async getAllOrder(
    req: Request<ParamsDictionary, any, any, ParsedQs>,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    await this.requestHandler(req, res, next, this.orderController.getAllOrder);
  }
}
