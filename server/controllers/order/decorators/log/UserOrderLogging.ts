import {IRoute} from "../../../../typings/Controller";
import ConfigureLogging from "../../../../utils/logger/ConfigureLogging";
import UserOrderController from "../../UserOrderController";
import {OrderLoggingDecorator} from "./OrderLoggingDecorator";

export default class UserOrderLoggingDecorator extends OrderLoggingDecorator {
  public path: string = "/api/order";
  public routes: IRoute[] = [];

  constructor(orderController: UserOrderController, logger: ConfigureLogging) {
    super(orderController, logger);
    this.routes = this.orderController.routes
  }

  // createLog(
  //   req: Request,
  //   res: Response,
  //   stopwatch: number,
  //   handler: Function,
  //   error?: string
  // ) {
  //   handler`${new Log(
  //     req.method,
  //     req.originalUrl,
  //     new Date(),
  //     res.statusCode,
  //     res.statusMessage,
  //     req.headers["user-agent"] || "unknown",
  //     stopwatch,
  //     req.socket.remoteAddress || "unknown",
  //     "orders",
  //     req.cookies,
  //     error
  //   )}`;
  // }

  // async requestHandler(
  //   req: Request,
  //   res: Response,
  //   next: NextFunction,
  //   handler: (req: Request, res: Response, next: NextFunction) => Promise<any>
  // ) {
  //   let stopwatch = 0;
  //   try {
  //     const start = process.hrtime();
  //     await handler(req, res, next);
  //     const end = process.hrtime();
  //     stopwatch = end[0] * 1e9 - start[0] * 1e9;
  //     this.createLog(req, res, stopwatch, this.logger.info);
  //   } catch (error: any) {
  //     this.createLog(req, res, stopwatch, this.logger.error, error.message);
  //   }
  // }

  // async createOrder(
  //   req: Request<ParamsDictionary, any, any, ParsedQs>,
  //   res: Response,
  //   next: NextFunction
  // ): Promise<any> {
  //   await this.requestHandler(req, res, next, this.orderController.createOrder);
  // }

  // async getOrderById(
  //   req: Request<ParamsDictionary, any, any, ParsedQs>,
  //   res: Response,
  //   next: NextFunction
  // ): Promise<any> {
  //   await this.requestHandler(
  //     req,
  //     res,
  //     next,
  //     this.orderController.getOrderById
  //   );
  // }
}
