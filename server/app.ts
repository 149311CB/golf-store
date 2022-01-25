import express, { Application, RequestHandler, json } from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import Server from "./server";
import DbLogger from "./utils/logger/DbLogger";
import path from "path";
import ConsoleLogger from "./utils/logger/ConsoleLogger";
import ConfigureLogging from "./utils/logger/ConfigureLogging";
import TemplateBuilder from "./utils/logger/TemplateBuilder";
import FileLogger from "./utils/logger/FileLogger";

// .env initialized
dotenv.config();

const app: Application = express();

// middleware to use in all routes
const globalMiddlewares: Array<RequestHandler> = [
  json(),
  cors({
    origin: ["http://localhost:3000",
      "https://localhost:3000",
      "http://localhost:3001",
      "https://localhost:3001",
      "http://golf-store.149311cb.tech",
      "https://golf-store.149311cb.tech"],
    methods: "GET, POST, PUT, DELETE",
    credentials: true,
  }),
  cookieParser(process.env.COOKIE_SECRET),
];

const logger = new ConfigureLogging([
  new ConsoleLogger({
    level: "info",
    template: new TemplateBuilder()
      .addLevel()
      .addText(" ")
      .addMessage()
      .addText(" ")
      .build(),
  }),
  new FileLogger({
    level: "info",
    path: path.join(__dirname, "/logs"),
    template: new TemplateBuilder()
      .addLevel()
      .addText(" ")
      .addMessage()
      .addText(" ")
      .build(),
  }),
  new DbLogger({
    level: "error",
  }),
]);

// initialized new instance of Server
let port = 5002
if (process.env.PORT) {
  port = parseInt(process.env.PORT);
}
const server: Server = new Server(app, port, globalMiddlewares);

export { logger, server }
