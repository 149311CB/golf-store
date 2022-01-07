import { Document, Model, model, PopulateOptions, Schema } from "mongoose";
import { Log } from "../types/BasicLogging";

class LogRepository {
  logSchema = new Schema<Log>({
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
  });

  model: Model<Log, any, any>;
  private static instance: LogRepository;

  private constructor() {
    this.model = model<Log>("Log", this.logSchema, "logs");
  }

  public static getInstance(): LogRepository {
    if (!LogRepository.instance) {
      LogRepository.instance = new LogRepository();
    }
    return LogRepository.instance;
  }

  async findById(
    id: string,
    options?: PopulateOptions | Array<PopulateOptions>
  ): Promise<Log & Document<any, any, Log>> {
    return await this.model.findById(id).populate(options);
  }

  async create(log: Log): Promise<Log | null> {
    return await this.model.create(log);
  }

  async countDocuments() {
    return this.model.countDocuments();
  }

  async all(
    limit: number = 10,
    skip: number = 0,
    options?: PopulateOptions | Array<PopulateOptions>
  ): Promise<Log & Document<any, any, Log>> {
    return await this.model
      .find()
      .limit(limit)
      .sort({ $natural: -1 })
      .skip(skip)
      .populate(options);
  }
}

export default LogRepository;
