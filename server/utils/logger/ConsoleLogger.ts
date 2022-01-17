import colors from "colors/safe";
import LoggerBase, { LoggerConfig } from "./LoggerBase";
import { inspect } from "util";
import { ILevel } from "./ILevel";

interface Config extends LoggerConfig {
  colorize?: boolean;
}

class ConsoleLogger extends LoggerBase<Config> {
  public static colors = colors;

  public constructor(unsafeConfig: Config) {
    colors.setTheme({
      alert: "orange",
      crit: "red",
      error: "cyan",
      warning: "yellow",
      notice: "blue",
      info: "green",
      debug: "rainbow",
    });
    const config = { ...unsafeConfig };
    super(config);
  }

  public format(value: any): string {
    if (Object.keys(value).length > 0) {
      return `${inspect(value, false, 2, true)}`;
    }

    return String(value);
  }

  private getConsoleMethod(level: string) {
    // @ts-ignore
    const method = console[level];

    if (method) {
      return method.bind(console);
    }

    return console.log.bind(console);
  }

  public log(
    strings: TemplateStringsArray,
    expression: any,
    level: ILevel,
    location: string
  ) {
    let msg = this.getMessage(strings, expression, level, location);

    const logToConsole = this.getConsoleMethod(this.config.level!);

    if (this.config.colorize) {
      // @ts-ignore
      msg = colors[level](message);
    }

    logToConsole(`${msg}\n`);

    return msg;
  }
}

export default ConsoleLogger;
