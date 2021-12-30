import LoggerBase from "./ILogger";
import { getLocation } from "./Location";
import { ILevel } from "./ILevel";
import DbLogger from "./DbLogger";
import StreamLogger from "./StreamLogger";

export class ConfigureLogging {
  loggers: Array<LoggerBase>;

  constructor(loggers: Array<LoggerBase>) {
    this.loggers = loggers;
  }

  log(level: ILevel) {
    return (strings: TemplateStringsArray, ...expressions: any[]): void => {
      return this.loggers.forEach((logger: LoggerBase) => {
        if (!logger.isAllowed(level)) {
          return null;
        }

        if (logger instanceof DbLogger || logger instanceof StreamLogger) {
          return logger.log(expressions);
        }

        // TODO: I don't like reduce
        const content = strings.reduce((prev, curr, index) => {
          // NOTICE: This is the default format in the config, not the format in the template
          const formatted = logger.format(expressions[index] || "");

          return `${prev}${curr}${formatted}`;
        }, "");

        // NOTICE: This will trigger the function returned by create template,
        // which will trigger format defined in template and return a string of messages
        const message = logger.getMessage({
          level,
          message: content,
          date: new Date(),
          location: getLocation(4),
        });

        return logger.log({ level, message });
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
