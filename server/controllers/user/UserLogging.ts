import { NextFunction, Request, Response } from "express";
import { Log } from "../../types/BasicLogging";
import Controller, { IRoute, Methods } from "../../typings/Controller";
import ConfigureLogging from "../../utils/logger/ConfigureLogging";

export interface IUserLogginDecorator extends Controller {
  login(req: Request, res: Response, next: NextFunction): Promise<any>;

  google(req: Request, res: Response, next: NextFunction): Promise<any>;

  googleCallback(req: Request, res: Response, next: NextFunction): Promise<any>;

  facebook(
    req: Request,
    res: Response,
    NextFunction: NextFunction
  ): Promise<any>;

  facebookCallback(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any>;

  refreshTokens(req: Request, res: Response, next: NextFunction): Promise<any>;

  register(req: Request, res: Response, next: NextFunction): Promise<any>;

  getuserDetails(req: Request, res: Response, next: NextFunction): Promise<any>;
}

export class UserLoggingDecorator
  extends Controller
  implements IUserLogginDecorator
{
  protected logger: ConfigureLogging;
  public path: string = "/api/user/auth";
  public routes: Array<IRoute> = [
    {
      path: "/login",
      method: Methods.POST,
      handler: this.login.bind(this),
      localMiddlewares: [],
    },
    {
      path: "/token/refresh",
      method: Methods.GET,
      handler: this.refreshTokens.bind(this),
      localMiddlewares: [],
    },
    {
      path: "/register",
      method: Methods.POST,
      handler: this.register.bind(this),
      localMiddlewares: [],
    },
    {
      path: "/login/google",
      method: Methods.GET,
      handler: this.google.bind(this),
      localMiddlewares: [],
    },
    {
      path: "/login/google/callback",
      method: Methods.GET,
      handler: this.googleCallback.bind(this),
      localMiddlewares: [],
    },
    {
      path: "/login/facebook",
      method: Methods.GET,
      handler: this.facebook.bind(this),
      localMiddlewares: [],
    },
    {
      path: "/login/facebook/callback",
      method: Methods.GET,
      handler: this.facebookCallback.bind(this),
      localMiddlewares: [],
    },
    {
      path: "/details",
      method: Methods.GET,
      handler: this.getuserDetails.bind(this),
      localMiddlewares: [],
    },
  ];

  userController: IUserLogginDecorator;

  constructor(
    userController: Controller & IUserLogginDecorator,
    logger: ConfigureLogging
  ) {
    super();
    this.userController = userController;
    this.logger = logger;
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
      "users",
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
      super.sendError(401, res, error.message);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<any> {
    await this.requestHandler(req, res, next, this.userController.login);
  }

  async google(req: Request, res: Response, next: NextFunction): Promise<any> {
    await this.requestHandler(req, res, next, this.userController.google);
  }

  async googleCallback(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    await this.requestHandler(
      req,
      res,
      next,
      this.userController.googleCallback
    );
  }

  async facebook(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    await this.requestHandler(req, res, next, this.userController.facebook);
  }

  async facebookCallback(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    await this.requestHandler(
      req,
      res,
      next,
      this.userController.facebookCallback
    );
  }

  async refreshTokens(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    await this.requestHandler(
      req,
      res,
      next,
      this.userController.refreshTokens
    );
  }

  async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    await this.requestHandler(req, res, next, this.userController.register);
  }

  async getuserDetails(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    await this.requestHandler(
      req,
      res,
      next,
      this.userController.getuserDetails
    );
  }
}
