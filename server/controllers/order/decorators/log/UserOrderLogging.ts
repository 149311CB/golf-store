import { IRoute, Methods } from "../../../../typings/Controller";
import ConfigureLogging from "../../../../utils/logger/ConfigureLogging";
import UserOrderController from "../../UserOrderController";
import { OrderLoggingDecorator } from "./OrderLoggingDecorator";

export default class UserOrderLoggingDecorator extends OrderLoggingDecorator {
  public routes: IRoute[] = [
    {
      path: "/auth/create",
      method: Methods.POST,
      handler: this.createOrder,
      localMiddlewares: [],
    },
    {
      path: "/auth/user/detail/:id",
      method: Methods.GET,
      handler: this.getOrderById,
      localMiddlewares: [],
    },
    {
      path: "/auth/user/all",
      method: Methods.GET,
      handler: this.getAllOrder,
      localMiddlewares: [],
    },
  ];

  constructor(orderController: UserOrderController, logger: ConfigureLogging) {
    super(orderController, logger);
  }

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
