import express, { Application, RequestHandler, json } from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import Server from "./server";
import Controller from "./typings/Controller";
import CategoryController from "./controllers/CategoryController";
import PaymentController from "./controllers/PaymentController";
import { EmployeeAuth } from "./controllers/employee/EmployeeAuth";
import ProductProtect from "./controllers/product/ProtectedProxy";
import { UserProtect } from "./controllers/user/UserProtected";
import UserOrderProtect from "./controllers/order/protects/UserOrderProtect";
import PublicCartProtect from "./controllers/cart/protect/PublicCartProtect";
import ConfigureLogging from "./utils/logger/ConfigureLogging";
import FileLogger from "./utils/logger/FileLogger";
import path from "path";
import TemplateBuilder from "./utils/logger/TemplateBuilder";
import LoggerController from "./controllers/logger/LoggerController";
import { UserLoggingDecorator } from "./controllers/user/UserLogging";
import DbLogger from "./utils/logger/DbLogger";
import OrderLoggingDecorator from "./controllers/order/decorators/log/UserOrderLogging";
import UserCartProtect from "./controllers/cart/protect/UserCartProtect";
import EmployeeOrderDecorator from "./controllers/order/decorators/log/EmployeeOrderDecorator";
import EmployeeOrderController from "./controllers/order/EmployeeOrderController";
import {UserCartLoggingDecorator} from "./controllers/cart/decorators/UserCartLoggingDecorator";
import {PublicCartLoggingDecorator} from "./controllers/cart/decorators/PublicCartLoggingDecorator";

// .env initialized
dotenv.config();

const app: Application = express();
// const database: Mongoose = new Mongoose();

// middleware to use in all routes
const globalMiddlewares: Array<RequestHandler> = [
  json(),
  cors({
    origin: "https://localhost:3000",
    methods: "GET, POST, PUT, DELETE",
    credentials: true,
  }),
  cookieParser(process.env.COOKIE_SECRET),
];

// initialized new instance of Server
const server: Server = new Server(app, 5001);
const logger = new ConfigureLogging([
  new FileLogger({
    level: "info",
    path: path.join(__dirname, "/logs"),
    template: new TemplateBuilder()
      .addLevel()
      .addText(" ")
      .addMessage()
      .addText(" ")
      .addDate()
      .build(),
  }),
  new DbLogger({
    level: "info",
  }),
]);

const controllers: Array<Controller> = [
  new ProductProtect(),
  new CategoryController(),
  new PublicCartLoggingDecorator(new PublicCartProtect(logger), logger),
  new UserCartLoggingDecorator(new UserCartProtect(logger), logger),
  new UserLoggingDecorator(new UserProtect(logger), logger),
  new PaymentController(),
  new OrderLoggingDecorator(new UserOrderProtect(logger), logger),
  new EmployeeOrderDecorator(new EmployeeOrderController(logger),logger),
  new EmployeeAuth(),
  new LoggerController(),
];

Promise.resolve()
  .then(() => server.connectDatabase())
  .then(() => {
    server.loadMiddlewares(globalMiddlewares);
    server.loadControllers(controllers);
    // Run http server
    server.run();
  });
