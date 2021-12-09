import express, { Application, RequestHandler, json } from "express";
import Server from "./server";
import cors from "cors";
import { Mongoose } from "mongoose";
import dotenv from "dotenv";
import Controller from "./typings/Controller";
import WellcomGateController from "./controllers/class/WelcomeGateController";

// .env initialized
dotenv.config();

const app: Application = express();
const database: Mongoose = new Mongoose();
// initialized new instance of Server
const server: Server = new Server(app, database, parseInt(process.env.PORT!));

// controllers
const controllers: Array<Controller> = [new WellcomGateController()];

// middleware to use in all routes
const globalMiddlewares: Array<RequestHandler> = [
  json(),
  cors({ origin: "*" }),
];

Promise.resolve()
  .then(() => server.connectDatabase())
  .then(() => {
    server.loadMiddlewares(globalMiddlewares);
    server.loadControllers(controllers);
    // Run http server
    server.run();
  });
