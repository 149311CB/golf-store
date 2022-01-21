import { Request, Response } from "express";
import { logger } from "../app";
import { Log } from "../types/BasicLogging";

function createLog(
  req: Request,
  res: Response,
  stopwatch: number,
  handler: Function,
  error?: string,
  location?: string
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
    "cart",
    req.cookies,
    error
  ).addLocation(location || "")}`;
}

const getErrorLocation = (e: any) => {
  try {
    const err: Error = e;
    console.log(err)
    const stackLocations = err.stack!
      .split("\n")
      .map((m) => m.trim())
      .filter((m) => m.startsWith("at"));

    return String(stackLocations[3]).slice(3);
  } catch (e) {
    return "";
  }
};

export function requestLog(): MethodDecorator {
  return function(_: Object, __: string | symbol, descriptor: PropertyDescriptor) {
    const original = descriptor.value
    descriptor.value = async function(...args: any[]) {
      let stopwatch = 0;
      const request = args[0] as Request
      const response = args[1] as Response
      let result: any = null
      try {
        const start = process.hrtime();
        result = await original.apply(this, args)
        const end = process.hrtime();
        stopwatch = end[0] * 1e9 - start[0] * 1e9;
        logger.info`${request.method} ${request.originalUrl}`;
      } catch (error: any) {
        createLog(request, response, stopwatch, logger.error, error.message, getErrorLocation(error));
      }
      return result
    }
  }
}

