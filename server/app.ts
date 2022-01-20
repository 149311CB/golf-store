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
    origin: ["https://localhost:3000", "https://localhost:3001", "http://localhost:3000", "http://localhost:3001"],
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
const server: Server = new Server(app, 5001, globalMiddlewares);

export { logger, server }
