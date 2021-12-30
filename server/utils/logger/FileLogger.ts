import fs from "fs";
import { inspect } from "util";
import LoggerBase, { LoggerConfig } from "./ILogger";

interface Config extends LoggerConfig {
  path: string;
}

class FileLogger extends LoggerBase<Config> {
  private fileStream: fs.WriteStream;

  public constructor(unsafeConfig: Config) {
    const config = { ...unsafeConfig };
    super(config);
    this.fileStream = fs.createWriteStream(config.path);
  }

  public format(value: any): string {
    if (Object.keys(value).length > 0) {
      return `${inspect(value, false, null, false)}`;
    }

    return String(value);
  }

  public log({ message, level }: { message: string; level: string }) {
    this.fileStream.write(`${message}\n`);

    return message;
  }
}

export default FileLogger;
