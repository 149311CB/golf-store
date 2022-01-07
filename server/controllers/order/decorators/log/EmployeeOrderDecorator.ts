import { NextFunction, Request, Response } from "express";
import UserOrderLoggingDecorator from "./UserOrderLogging";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import EmployeeOrderController from "../../EmployeeOrderController";
import ConfigureLogging from "../../../../utils/logger/ConfigureLogging";
import { IRoute } from "../../../../typings/Controller";
import {OrderLoggingDecorator} from "./OrderLoggingDecorator";

export default class EmployeeOrderDecorator extends OrderLoggingDecorator {
  public path: string = "/api/order";
  public routes: IRoute[] = [];
  orderController: EmployeeOrderController;
  constructor(
    orderController: EmployeeOrderController,
    logger: ConfigureLogging
  ) {
    super(orderController, logger);
    this.orderController = orderController;
    this.routes = this.orderController.routes;
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

