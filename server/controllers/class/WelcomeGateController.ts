import { NextFunction, Request, Response } from "express";
import Controller, { Methods } from "../../typings/Controller";

export default class WellcomGateController extends Controller {
  public path = "/";
  protected routes = [
    {
      path: "/wellcome",
      method: Methods.GET,
      handler: this.wellcomeHandler,
      localMiddlewares: [],
    },
  ];
  constructor() {
    super();
  }
  async wellcomeHandler(
    _: Request,
    res: Response,
    __: NextFunction
  ): Promise<void> {
    try {
      super.sendSuccess(200, res, {}, "Api is running..");
    } catch (error) {
      console.log(error);
      super.sendError(500, res);
    }
  }
}
