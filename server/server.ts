import { Application, RequestHandler } from "express";
import https from "https";
import fs from "fs";
import { connect } from "mongoose";
import Controller from "./typings/Controller";

export default class Server {
  private _app: Application;
  // private _database: Mongoose;
  private readonly _port: number;

  constructor(app: Application, port: number) {
    this._app = app;
    this._port = port;
  }

  public run(): https.Server {
    const credentials = {
      key: fs.readFileSync("./localhost-key.pem"),
      cert: fs.readFileSync("./localhost.pem"),
    };
    const httpsServer = https.createServer(credentials, this._app);
    return httpsServer.listen(this._port, () => {
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

