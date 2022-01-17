import { Application, RequestHandler } from "express";
import https from "https";
import fs from "fs";
import { connect } from "mongoose";
import Controller from "./typings/Controller";

export default class Server {
  private readonly _app: Application;
  private readonly _port: number;
  private controllers: Array<Controller>;
  private middlewares: Array<RequestHandler>;

  constructor(
    app: Application,
    port: number,
    controllers: Array<Controller>,
    middlewares: Array<RequestHandler>
  ) {
    this._app = app;
    this._port = port;
    this.controllers = controllers;
    this.middlewares = middlewares;
  }

  public async run(): Promise<https.Server> {
    await this.connectDatabase();
    this.loadMiddlewares();
    this.loadControllers();
    return this.createServer();
  }

  private createServer(): https.Server {
    const credentials = {
      key: fs.readFileSync("./localhost-key.pem"),
      cert: fs.readFileSync("./localhost.pem"),
    };
    const httpsServer = https.createServer(credentials, this._app);
    return httpsServer.listen(this._port, () => {
      console.log(`server is running on port ${this._port} `);
    });
  }

  private loadControllers(): void {
    this.controllers.forEach((controller) => {
      this._app.use(controller.path, controller.setRoutes());
    });
  }

  private loadMiddlewares(): void {
    this.middlewares.forEach((middleware) => {
      this._app.use(middleware);
    });
  }

  private async connectDatabase(): Promise<void> {
    try {
      const conn = await connect(process.env.MONGO_URI!, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true,
      });
      console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error: any) {
      console.error(`ERROR: ${error.message}`);
      process.exit(1);
    }
  }
}
