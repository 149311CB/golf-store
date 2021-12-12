import { Response, Request, NextFunction, Router } from "express";

export enum Methods {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}

interface IRoute {
  path: string;
  method: string;
  handler: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => void | Promise<void>;
  localMiddlewares: ((
    req: Request,
    res: Response,
    next: NextFunction
  ) => void)[];
}

export default abstract class Controller {
  public router: Router = Router();
  public abstract path: string;
  protected abstract readonly routes: Array<IRoute>;

  public setRoutes = (): Router => {
    for (let route of this.routes) {
      for (let mw of route.localMiddlewares) {
        this.router.use(route.path, mw);
      }
      switch (route.method) {
        case Methods.GET:
          this.router.get(route.path, route.handler);
          break;
        case Methods.POST:
          this.router.post(route.path, route.handler);
          break;
        case Methods.PUT:
          this.router.put(route.path, route.handler);
          break;
        case Methods.DELETE:
          this.router.delete(route.path, route.handler);
      }
    }
    return this.router;
  };

  protected sendSuccess(
    status: number,
    res: Response,
    data: object | null,
    message?: string
  ): Response {
    return res.status(status).json({
      message: message || "success",
      data,
    });
  }

  protected sendError(
    status: number,
    res: Response,
    message?: string
  ): Response {
    return res
      .status(status)
      .json({ message: message || "internal server error" });
  }

  protected sendRedirect(res: Response, url: string) {
    res.redirect(url);
  }
}
