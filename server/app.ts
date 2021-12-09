import express, { Application, RequestHandler, json } from "express";
import Server from "./server";
import cors from "cors";
import dotenv from "dotenv";
import Controller from "./typings/Controller";
import WellcomGateController from "./controllers/class/WelcomeGateController";
import ProductController from "./controllers/class/ProductController";
import CategoryController from "./controllers/class/CategoryController";

// .env initialized
dotenv.config();

const app: Application = express();
// const database: Mongoose = new Mongoose();

// middleware to use in all routes
const globalMiddlewares: Array<RequestHandler> = [
  json(),
  cors({ origin: "*" }),
];

// initialized new instance of Server
const server: Server = new Server(app, 5001);

const controllers: Array<Controller> = [
  new WellcomGateController(),
  new ProductController(),
  new CategoryController(),
];

Promise.resolve()
  .then(() => server.connectDatabase())
  .then(() => {
    server.loadMiddlewares(globalMiddlewares);
    server.loadControllers(controllers);
    // Run http server
    server.run();
  });
