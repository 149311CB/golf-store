import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import jwt from "jsonwebtoken";
import { ParsedQs } from "qs";
import { ITokenValidateDecorator } from "./AuthenticateDecorator";

export class TokenValidateBase implements ITokenValidateDecorator {
  protected decoded: jwt.JwtPayload | undefined;
  protected secret: string;
  protected extractStrategy: IExtractTokenStrategy;
  public passReqToHandler: boolean;

  public constructor(
    extractStrategy: IExtractTokenStrategy,
    secret: string,
    passReqToHandler = false
  ) {
    this.extractStrategy = extractStrategy;
    this.secret = secret;
    this.passReqToHandler = passReqToHandler;
  }

  public validateToken(req: Request, _: Response): jwt.JwtPayload {
    const token = this.extractToken(req);
    if (!token) {
      throw new Error("UnAuthorized, token not found");
    }

    const result = this.verifyToken(token);

    if (!result) {
      throw new Error("UnAuthorized, token failed");
    }

    this.decoded = result;
    return this.decoded;
  }

  public extractToken(req: Request): string | null {
    return this.extractStrategy.extract(req);
  }

  protected verifyToken(token: string): jwt.JwtPayload | null {
    const decoded = jwt.verify(token, this.secret);
    if (typeof decoded === "string") {
      return null;
    }
    return decoded;
  }
}

export interface IExtractTokenStrategy {
  extract(req: Request): string | null;
}

export class HeaderExtract implements IExtractTokenStrategy {
  extract(
    req: Request<ParamsDictionary, any, any, ParsedQs>
  ): string | null {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      return req.headers.authorization.split(" ")[1];
    }
    return null;
  }
}

export class CookieExtraction implements IExtractTokenStrategy {
  protected cookieName: string;

  constructor(tokenName: string) {
    this.cookieName = tokenName;
  }

  extract(
    req: Request<ParamsDictionary, any, any, ParsedQs>
  ): string | null {
    const { signedCookies = {} } = req;
    if (signedCookies) {
      const token = signedCookies[this.cookieName];
      if (token) {
        return token;
      }
    }
    return null;
  }
}
