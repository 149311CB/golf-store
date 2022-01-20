import fs from "fs";
import { inspect } from "util";
import { ILevel } from "./ILevel";
import LoggerBase, { LoggerConfig } from "./LoggerBase";

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

  public log(
    strings: TemplateStringsArray,
    expression: any[],
    level: ILevel,
  ) {
    const result = this.getMessage(strings, expression, level,"");
    this.fileStream.write(`${__dirname}/${result}\n`);

    return strings;
  }
}

export default FileLogger;
