import colors from "colors/safe";
import LoggerBase, { LoggerConfig } from "./ILogger";
import { inspect } from "util";

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
      return `\n${inspect(value, false, 2, true)}\n`;
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

  public log({ message, level }: { message: string; level: string }) {
    let msg = message;

    const logToConsole = this.getConsoleMethod(level);

    if (this.config.colorize) {
      // @ts-ignore
      msg = colors[level](message);
    }

    logToConsole(`${msg}\n`);

    return msg;
  }
}

export default ConsoleLogger;
