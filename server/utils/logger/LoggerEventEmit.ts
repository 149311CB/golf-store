import { EventEmitter } from "events";

export default class LoggerEventEmit {
  private static emitter: EventEmitter;
  private static instance: LoggerEventEmit;
  private constructor() {}

  public static getInstance() {
    if (!LoggerEventEmit.instance) {
      LoggerEventEmit.instance = new LoggerEventEmit();
      LoggerEventEmit.emitter = new EventEmitter();
    }
    return LoggerEventEmit.instance;
  }

  emitter(): EventEmitter {
    return LoggerEventEmit.emitter;
  }
}
