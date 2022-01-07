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
    return (strings: TemplateStringsArray, ...expressions: any[]): void => {
      return this.loggers.forEach((logger: LoggerBase) => {
        if (!logger.isAllowed(level)) {
          return null;
        }

        return logger.log(strings, expressions, level, getLocation(4));
      });
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
