import { NextFunction, Request, Response } from "express";

export interface ILoggerController {
  login(req: Request, res: Response, _: NextFunction): Promise<any>;

  google(_: Request, res: Response, __: NextFunction): Promise<any>;

  googleCallback(req: Request, res: Response, _: NextFunction): Promise<any>;

  facebook(req: Request, res: Response, __: NextFunction): Promise<any>;

  facebookCallback(req: Request, res: Response, _: NextFunction): Promise<any>;

  refreshTokens(req: Request, res: Response, _: NextFunction): Promise<any>;

  register(req: Request, res: Response, _: NextFunction): Promise<any>;

  getuserDetails(req: Request, res: Response, _: NextFunction): Promise<any>;
}
