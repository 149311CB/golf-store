import LoggerBase from "./ILogger";
import LoggerEventEmit from "./LoggerEventEmit";

class StreamLogger extends LoggerBase {
  public log(data: any) {
    LoggerEventEmit.getInstance().emitter().emit("stream", data[0]);
  }
}

export default StreamLogger;
