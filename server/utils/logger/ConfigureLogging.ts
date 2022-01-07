import LoggerBase from "./LoggerBase";
import { getLocation } from "./Location";
import { ILevel } from "./ILevel";

export class ConfigureLogging {
  loggers: Array<LoggerBase>;

  constructor(loggers: Array<LoggerBase>) {
    this.loggers = loggers;
  }

  // This should be for string base logging only
  log(level: ILevel) {
    return async (
      strings: TemplateStringsArray,
      ...expressions: any[]
    ): Promise<void> => {
      for (let index = 0; index < this.loggers.length; index++) {
        const logger = this.loggers[index];
        if (!logger.isAllowed(level)) {
          return;
        }

        await logger.log(strings, expressions, level, getLocation(4));
      }
    };
  }

  alert = this.log("alert");
  crit = this.log("crit");
  error = this.log("error");
  warning = this.log("warning");
  notice = this.log("notice");
  info = this.log("info");
  debug = this.log("debug");
}

export default ConfigureLogging;
