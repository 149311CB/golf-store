import { NextFunction, Request, RequestHandler, Response } from "express";
import { server } from "../app";

export const methods = {
  get: "get",
  post: "post",
  put: "put",
  delete: "delete",
  patch: "patch"
}

export interface RouteConfigProps {
  method: keyof typeof methods,
  path: string,
  middlewares?: Array<RequestHandler>
}

export const routeConfig = ({ method, path, middlewares }: RouteConfigProps): MethodDecorator => {
  console.log(method + " " + path)
  return (_: Object, __: string | symbol, descriptor: PropertyDescriptor) => {
    let handlers: Array<RequestHandler> = [];
    if (middlewares && middlewares.length > 0) {
      handlers = [...handlers, ...middlewares];
    }

    const response = async (req: Request, res: Response, next: NextFunction) => {
      try {
        await descriptor.value(req, res, next)
      } catch (error: any) {
        console.log(error.message)
        res.status(500).json({ message: "some error occurred" })
      }
    }

    handlers = [...handlers, response];
    server.app[method](path, ...handlers);
  }
}
