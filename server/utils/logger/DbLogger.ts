import LogRepository from "../../models/LogRepository";
import LoggerBase from "./ILogger";
import LoggerEventEmit from "./LoggerEventEmit";

class DbLogger extends LoggerBase {
  public async log(data: any): Promise<void> {
    const log = await LogRepository.getInstance().create(data);
    LoggerEventEmit.getInstance().emitter().emit("stream", log);
  }
}

export default DbLogger;
