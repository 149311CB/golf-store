import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import UserRepository from "../repositories/UserRepository";
import { NextFunction, Request, Response } from "express";
import { TokenValidateDecorator } from "../controllers/auth/AuthenticateDecorator";
import { CookieExtraction, HeaderExtract, TokenValidateBase } from "../controllers/auth/AuthenticateBase";
import { EmployeeTypes } from "../types/userTypes";
import EmployeeRepository from "../repositories/employeeModel";

const protect = asyncHandler(async (req, res, next) => {
  let token;
  try {
    const result = verifyToken(req);
    if (result) {
      // @ts-ignore
      const { userId, ...rest } = result;
      // if the user exist in token, use user
      if (userId) {
        const user = await UserRepository.findById(userId).select("-password");
        req.body = { ...req.body, rest, user };
        return next();
      }
      return res.status(401).json({ message: "Not authorized, token found" });
    }
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, token failed" });
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
});

export const verifyToken = (req: any) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
    if (token !== "null") {
      const secret = process.env.JWT_SECRET;
      if (secret) {
        return jwt.verify(token, secret);
      }
    }
  }
  return {};
};

export async function jwtValidate(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {
  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      let token;
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET!);
      if (typeof decoded === "string") {
        return res.status(400).json({ message: "invalid token" });
      }

      const user = await UserRepository.findById(decoded.userId);
      if (!user) {
        return res.status(401).json({ message: "UnAuthorized" });
      }
      req.user = user;
      return next();
    }
    return res.status(401).json({ message: "UnAuthorized" });
  } catch (error) {
    return res.status(401).json({ message: "UnAuthorized" });
  }
}

export async function userProtected(req: Request, res: Response, next: NextFunction) {
  try {
    const service = new TokenValidateDecorator(
      new TokenValidateBase(new HeaderExtract(), process.env.JWT_SECRET!)
    );
    const { userId } = await service.validateToken(req, res);
    const user = await UserRepository.findById(userId);
    if (!user) {
      return res.status(401).send("UnAthorized, invalid token");
    }
    req.user = user
    next();
  } catch (error) {
    next(error);
  }
}

export async function refreshTokenProtected(req: Request, res: Response, next: NextFunction) {
  try {
    const cookieExtraction = new CookieExtraction("refresh_token");

    const service = new TokenValidateDecorator(
      new TokenValidateBase(
        cookieExtraction,
        process.env.REFRESH_TOKEN_SECRET!
      ),
    );
    // get token from request
    const token = cookieExtraction.extract(req);

    // get userId
    const { userId } = await service.validateToken(req, res);
    if (!userId) {
      throw new Error("UnAuthorized, token failed");
    }
    const user = await UserRepository.findById(userId);

    // Compare token from request with current token
    if (!user || user.refreshToken !== token) {
      return res.status(401).send("UnAthorized, invalid token");
    }

    req.user = user;
    next();
  } catch (error) {
    return
  }
}

export async function publicCartProtected(req: Request, res: Response, next: NextFunction) {
  const cookieExtraction = new CookieExtraction("cart_token");
  const service = new TokenValidateDecorator(
    new TokenValidateBase(
      cookieExtraction,
      process.env.REFRESH_TOKEN_SECRET!,
      true
    ),
  );
  const { cartId } = await service.validateToken(req, res);
  req.cartId = cartId
  next()
}

export async function userCartProtected(req: Request, res: Response, next: NextFunction) {
  try {
    const headerExtraction = new HeaderExtract();
    const service = new TokenValidateDecorator(
      new TokenValidateBase(headerExtraction, process.env.JWT_SECRET!),
    );
    const { userId } = await service.validateToken(req, res);
    req.userId = userId;
    next();
  } catch (error) {
    console.log(error)
  }
}

export function checkEmployeePermission(employee: EmployeeTypes, type: "write" | "read", resource: string) {
  return employee.role.permissions.find((permission) => {
    return (
      (permission.resource === resource || permission.resource === "all") &&
      permission[type] === true
    );
  });
}

export function checkReadOrderPermission(req: Request, _: Response, next: NextFunction) {
  const { employee } = req
  checkEmployeePermission(employee, "read", "order")
  next()
}

export function checkWriteOrderPermission(req: Request, _: Response, next: NextFunction) {
  const { employee } = req
  checkEmployeePermission(employee, "write", "order")
  next()
}

export async function getEmployeeInfo(req: Request, res: Response, next: NextFunction) {
  // validate bearer token
  const service = new TokenValidateDecorator(
    new TokenValidateBase(new HeaderExtract(), process.env.JWT_SECRET!),
  );

  const { employeeId } = await service.validateToken(req, res);

  const employee = await EmployeeRepository.findById(employeeId).populate({
    path: "role",
    populate: { path: "permission" },
  });

  req.employee = employee!
  next()
}

export async function getUserInfo(req: Request, res: Response, next: NextFunction) {
  const service = new TokenValidateDecorator(
    new TokenValidateBase(new HeaderExtract(), process.env.JWT_SECRET!),
  );
  const { userId } = await service.validateToken(req, res);
  req.user = await UserRepository.findById(userId);
  next();
}

export { protect };
