import { model, Schema } from "mongoose";
import { Log } from "../types/BasicLogging";

const logSchema = new Schema<Log>({
  level: { type: String, required: false },
  method: { type: String, required: true },
  route: { type: String, required: true },
  date: { type: Date, required: true },
  statusCode: { type: Number, required: true },
  statusText: { type: String, required: true },
  agent: { type: String, required: true },
  duration: { type: String, required: true },
  user_ip: { type: String, required: true },
  access_resource: { type: String, required: true },
  cookies: { type: Object, required: true },
  message: { type: String, required: false },
  token: { type: String, required: false },
  payload: { type: Object, required: false },
  location: { type: String, required: false },
  info: { type: String, required: false },
});

const LogRepository = model<Log>("Log", logSchema, "logs");
export default LogRepository;
