import { NextFunction, Request, Response } from "express";
import { routeConfig } from "../../middlewares/routeConfig";
import LogRepository from "../../repositories/LogRepository";
import Controller, { Methods } from "../../typings/Controller";
import LoggerEventEmit from "../../utils/logger/LoggerEventEmit";

export default class LoggerController extends Controller {
  public path = "/api/logs";
  public routes = [
    {
      path: "/stream",
      method: Methods.GET,
      handler: this.requestLog,
      localMiddlewares: [],
    },
    {
      path: "/all",
      method: Methods.GET,
      handler: this.requestLogs,
      localMiddlewares: [],
    },
  ];

  sendData(data: any, res: Response) {
    res.write("data: " + JSON.stringify(data) + "\n\n");
    res.end();
  }

  async getLatestRecords(req: Request) {
    const { page = 0 } = req.query;
    const total = await LogRepository.countDocuments();

    const logs = await LogRepository.find({})
      .limit(10)
      .skip(parseInt(page as string) * 10);

    const pages = Math.floor(total / 10) + (total % 10);
    return { logs, total, pages, page: parseInt(page as string) };
  }

  @routeConfig({ method: "get", path: "/api/logs" + "/stream" })
  async requestLog(req: Request, res: Response, __: NextFunction) {
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    });

    LoggerEventEmit.getInstance()
      .emitter()
      .on("stream", async (data) => {
        this.sendData(
          {
            stream: data,
            latest: await this.getLatestRecords(req),
          },
          res
        );
      });
  }

  @routeConfig({ method: "get", path: "/api/logs" + "/all" })
  async requestLogs(req: Request, res: Response, __: NextFunction) {
    try {
      super.sendSuccess(200, res, await this.getLatestRecords(req));
    } catch (error) {
      super.sendError(500, res);
    }
  }
}
