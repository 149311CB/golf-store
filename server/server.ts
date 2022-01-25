import { Application, RequestHandler } from "express";
import https from "https";
import http from "http";
import fs from "fs";
import { connect } from "mongoose";

export default class Server {
  private readonly _app: Application;
  private readonly _port: number;
  private middlewares: Array<RequestHandler>;

  get app(): Application {
    return this._app
  }

  constructor(
    app: Application,
    port: number,
    middlewares: Array<RequestHandler>
  ) {
    this._app = app;
    this._port = port;
    this.middlewares = middlewares;
  }

  public async run(): Promise<https.Server | http.Server> {
    await this.connectDatabase();
    return this.createServer();
  }

  private createServer(): https.Server | http.Server {
    if (process.env.NODE_ENV === "development") {
      const credentials = {
        key: fs.readFileSync("./localhost-key.pem"),
        cert: fs.readFileSync("./localhost.pem"),
      };
      const httpsServer = https.createServer(credentials, this._app);
      return httpsServer.listen(this._port, () => {
        console.log(`server is running on port ${this._port} `);
      });
    }
    return this.app.listen(this._port, () => {
      console.log(`server is running on port ${this._port} `);
    })
  }

  public loadMiddlewares(): void {
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
