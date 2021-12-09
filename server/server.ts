import { Application, RequestHandler } from "express";
import http from "http";
import { Mongoose } from "mongoose";
import Controller from "./typings/Controller";

export default class Server {
  private _app: Application;
  private _database: Mongoose;
  private readonly _port: number;

  constructor(app: Application, database: Mongoose, port: number) {
    this._app = app;
    this._database = database;
    this._port = port;
  }

  public run(): http.Server {
    return this._app.listen(this._port, () => {
      console.log(`server is running on port ${this._port} `);
    });
  }

  public loadControllers(controllers: Array<Controller>): void {
    controllers.forEach((controller) => {
      this._app.use(controller.path, controller.setRoutes());
    });
  }

  public loadMiddlewares(middlewares: Array<RequestHandler>): void {
    middlewares.forEach((middleware) => {
      this._app.use(middleware);
    });
  }

  public async connectDatabase(): Promise<void> {
    try {
      const conn = await this._database.connect(process.env.MONGO_URI!, {
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
