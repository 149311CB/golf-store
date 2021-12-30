import { ILevel } from "./ILevel";
import { Level } from "./Level";
import { IInfo } from "./TemplateBuilder";

interface LoggerConfig {
  format?: (value: any) => string;
  level?: ILevel;
  template?: (info: IInfo) => string;
}

abstract class LoggerBase<T extends LoggerConfig = LoggerConfig> {
  protected defaultConfig: Partial<LoggerConfig> = {
    template: ({ message }) => message,
    format: JSON.stringify,
    level: "info",
  };

  public config: T;
  public constructor(config: T) {
    this.config = { ...this.defaultConfig, ...(config as any) };
  }

  public isAllowed(level: ILevel): boolean {
    return Level.isAllowed(this.config.level!, level);
  }

  public format(value: any): string {
    return this.config.format!(value);
  }

  public getMessage(info: IInfo): string {
    return this.config.template!(info);
  }

  public abstract log(info: any): any;
}

export { LoggerConfig };

export default LoggerBase;
