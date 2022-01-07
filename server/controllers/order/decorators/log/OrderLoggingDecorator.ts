import { OrderDecorator } from "./OrderDecorator";
import { NextFunction, Request, Response } from "express";
import { Log } from "../../../../types/BasicLogging";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";

export abstract class OrderLoggingDecorator extends OrderDecorator {
  public path = "/api/order";
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
      // this.createLog(req, res, stopwatch, this.logger.info);
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

  async getOrderById(
    req: Request<ParamsDictionary, any, any, ParsedQs>,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    await this.requestHandler(
      req,
      res,
      next,
      this.orderController.getOrderById
    );
  }
}
