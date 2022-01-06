import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { TokenLog } from "../../types/BasicLogging";
import ConfigureLogging from "../../utils/logger/ConfigureLogging";
import { TokenValidateBase } from "./AuthenticateBase";

export interface ITokenValidateDecorator {
  validateToken(req: Request, res: Response): jwt.JwtPayload;
}

export class TokenValidateDecorator implements ITokenValidateDecorator {
  tokenValidateBase: TokenValidateBase;
  logger: ConfigureLogging;
  constructor(tokenValidateBase: TokenValidateBase, logger: ConfigureLogging) {
    this.tokenValidateBase = tokenValidateBase;
    this.logger = logger;
  }

  createLog(
    req: Request,
    res: Response,
    stopwatch: number,
    token: string | null,
    payload: jwt.JwtPayload,
    error: any
  ) {
    this.logger.error`${new TokenLog(
      req.method,
      req.originalUrl,
      new Date(),
      res.statusCode,
      res.statusMessage || "unknown",
      req.headers["user-agent"] || "unknown",
      stopwatch,
      req.socket.remoteAddress || "unknown",
      "orders",
      req.cookies,
      token || "",
      payload,
      error
    )}`;
  }

  validateToken(req: Request, res: Response): jwt.JwtPayload {
    let stopwatch = 0;
    let payload = {};
    const token = this.tokenValidateBase.extractToken(req);
    try {
      payload = this.tokenValidateBase.validateToken(req, res);
      this.createLog(req, res, stopwatch, token, payload, null);
      return payload;
    } catch (error: any) {
      this.createLog(req, res, stopwatch, token, payload, error);
      if (this.tokenValidateBase.passReqToHandler) {
        return {};
      }
      return res.status(401).json({ message: error.message });
    }
  }
}
