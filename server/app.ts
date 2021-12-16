import express, { Application, RequestHandler, json } from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import Server from "./server";
import Controller from "./typings/Controller";
import ProductController from "./controllers/class/ProductController";
import CategoryController from "./controllers/class/CategoryController";
import CartController from "./controllers/class/CartController";
import AuthController from "./controllers/class/UserController";
import PaymentController from "./controllers/class/PaymentController";
import OrderController from "./controllers/class/OrderController";

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

const controllers: Array<Controller> = [
  new ProductController(),
  new CategoryController(),
  new CartController(),
  new AuthController(),
  new PaymentController(),
  new OrderController(),
];

Promise.resolve()
  .then(() => server.connectDatabase())
  .then(() => {
    server.loadMiddlewares(globalMiddlewares);
    server.loadControllers(controllers);
    // Run http server
    server.run();
  });
