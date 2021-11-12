import {Server} from "./server-class"
import { Request, Response } from "express";

enum METHOD {
  GET = "get",
  POST = "post"
}

const server = new Server()

