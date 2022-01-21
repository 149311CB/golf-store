import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { logger } from "../../app";
import { Log } from "../../types/BasicLogging";
import { TokenValidateBase } from "./AuthenticateBase";

export interface ITokenValidateDecorator {
  validateToken(req: Request, res: Response): jwt.JwtPayload;
}

export class TokenValidateDecorator implements ITokenValidateDecorator {
  tokenValidateBase: TokenValidateBase;
  constructor(tokenValidateBase: TokenValidateBase) {
    this.tokenValidateBase = tokenValidateBase;
  }

  async createLog(
    req: Request,
    res: Response,
    stopwatch: number,
    token: string | null,
    payload: jwt.JwtPayload,
    error: any
  ) {
    await logger.error`${new Log(
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
      error,
      { token, payload }
    )}`;
  }

  async validateToken(req: Request, res: Response): Promise<jwt.JwtPayload> {
    let stopwatch = 0;
    let payload = {};
    const token = this.tokenValidateBase.extractToken(req);
    try {
      payload = this.tokenValidateBase.validateToken(req, res);
      return payload;
    } catch (error: any) {
      await this.createLog(req, res, stopwatch, token, payload, error.message);

      if (this.tokenValidateBase.passReqToHandler) {
        return {};
      }
      res.status(401).json({ message: error.message });
      throw new Error(error.message);
    }
  }
}

