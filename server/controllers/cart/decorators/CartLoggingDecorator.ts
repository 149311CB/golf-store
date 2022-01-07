import {NextFunction, Request, Response} from "express";
import {ParamsDictionary} from "express-serve-static-core";
import {ParsedQs} from "qs";
import {Log} from "../../../types/BasicLogging";
import ConfigureLogging from "../../../utils/logger/ConfigureLogging";
import {CartController} from "../CartController";
import {CartDecorator} from "./CartDecorator";

export default abstract class CartLoggingDecorator extends CartDecorator {
  public path = "/api/carts";

  constructor(cartController: CartController, logger: ConfigureLogging) {
    super(cartController, logger);
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
      res.statusMessage || "unknown",
      req.headers["user-agent"] || "unknown",
      stopwatch,
      req.socket.remoteAddress || "unknown",
      "cart",
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
      handler = handler.bind(this);
      await handler(req, res, next);
      const end = process.hrtime();
      stopwatch = end[0] * 1e9 - start[0] * 1e9;
    } catch (error: any) {
      this.createLog(req, res, stopwatch, this.logger.error, error.message);
    }
  }

  async getActiveCart(
    req: Request<ParamsDictionary, any, any, ParsedQs>,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    await this.requestHandler(req, res, next, super.getActiveCart);
  }

  async addToCart(
    req: Request<ParamsDictionary, any, any, ParsedQs>,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    await this.requestHandler(req, res, next, super.addToCart);
  }

  async removeProduct(
    req: Request<ParamsDictionary, any, any, ParsedQs>,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    await this.requestHandler(req, res, next, super.removeProduct);
  }

  async updateQty(
    req: Request<ParamsDictionary, any, any, ParsedQs>,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    await this.requestHandler(req, res, next, super.updateQty);
  }

  async countItem(
    req: Request<ParamsDictionary, any, any, ParsedQs>,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    console.log("decorator");
    await this.requestHandler(req, res, next, super.countItem);
  }
}

