import dotenv from "dotenv";
import { connect } from "mongoose";
import * as http from "http";
import express, { Express } from "express";
import cors from "cors";

export class Server {
  private readonly _app: Express;
  private _server!: http.Server;

  get app(): Express {
    return this._app;
  }
  get server(): http.Server {
    return this._server;
  }

  constructor() {
    dotenv.config();
    this._app = express();
    this._app.set("PORT", process.env.PORT || 5000);
    this.connectDB();
    this.configureMiddleware();
  }

  connectDB = async () => {
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
  };

  public configureMiddleware = () => {
    this._app.use(express.json());
    this._app.use(cors({ origin: "*" }));
  };

  public start = () => {
    this._server = this._app.listen(this._app.get("PORT"), () => {
      console.log(`Server is running on port ${this._app.get("PORT")}`);
    });
  };
}
