import { NextFunction, Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { Log } from "../../types/BasicLogging";
import Controller, { IRoute, Methods } from "../../typings/Controller";
import ConfigureLogging from "../../utils/logger/ConfigureLogging";
import OrderController from "./OrderController";

export interface IOrderLoggingDecorator {
  createOrder(req: Request, res: Response, _: NextFunction): Promise<any>;

  confirmOrder(req: Request, res: Response, _: NextFunction): Promise<any>;

  cancelOrder(req: Request, res: Response, _: NextFunction): Promise<any>;

  shipOrder(req: Request, res: Response, _: NextFunction): Promise<any>;

  completeOrder(req: Request, res: Response, _: NextFunction): Promise<any>;

  getAllOrder(_: Request, res: Response, __: NextFunction): Promise<any>;

  getOrderById(req: Request, res: Response, __: NextFunction): Promise<any>;
}

export default class OrderLoggingDecorator
  extends Controller
  implements IOrderLoggingDecorator
{
  protected logger: ConfigureLogging;
  protected orderController: OrderController;
  public path: string = "/api/order";
  public routes: IRoute[] = [
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

  constructor(orderController: OrderController, logger: ConfigureLogging) {
    super();
    this.logger = logger;
    this.orderController = orderController;
  }

  createLog(
    req: Request,
    res: Response,
    stopwatch: number,
    handler: Function,
    error?: string
  ) {
    handler`${new Log(
      req.method,
      req.originalUrl,
      new Date(),
      res.statusCode,
      res.statusMessage,
      req.headers["user-agent"] || "unknown",
      stopwatch,
      req.socket.remoteAddress || "unknown",
      "orders",
      req.cookies,
      error
    )}`;
  }

  async requestHandler(
    req: Request,
    res: Response,
    next: NextFunction,
    handler: (req: Request, res: Response, next: NextFunction) => Promise<any>
  ) {
    let stopwatch = 0;
    try {
      const start = process.hrtime();
      await handler(req, res, next);
      const end = process.hrtime();
      stopwatch = end[0] * 1e9 - start[0] * 1e9;
      this.createLog(req, res, stopwatch, this.logger.info);
    } catch (error: any) {
      this.createLog(req, res, stopwatch, this.logger.error, error.message);
    }
  }

  async createOrder(
    req: Request<ParamsDictionary, any, any, ParsedQs>,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    await this.requestHandler(req, res, next, this.orderController.createOrder);
  }
  async confirmOrder(
    req: Request<ParamsDictionary, any, any, ParsedQs>,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    await this.requestHandler(req, res, next, this.orderController.confirmOrder);
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
    await this.requestHandler(req, res, next, this.orderController.completeOrder);
  }
  async getAllOrder(
    req: Request<ParamsDictionary, any, any, ParsedQs>,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    await this.requestHandler(req, res, next, this.orderController.getAllOrder);
  }
  async getOrderById(
    req: Request<ParamsDictionary, any, any, ParsedQs>,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    await this.requestHandler(req, res, next, this.orderController.getOrderById);
  }
}
