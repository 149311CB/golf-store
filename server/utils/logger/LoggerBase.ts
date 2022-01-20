import {ILevel} from "./ILevel";
import {Level} from "./Level";
import {IInfo} from "./TemplateBuilder";

export interface LoggerConfig {
    format?: (value: any) => string;
    level?: ILevel;
    template?: (info: IInfo) => string;
}

abstract class LoggerBase<T extends LoggerConfig = LoggerConfig> {
    protected defaultConfig: Partial<LoggerConfig> = {
        template: ({message}) => message,
        format: JSON.stringify,
        level: "info",
    };

    public config: T;

    public constructor(config: T) {
        this.config = {...this.defaultConfig, ...(config as any)};
    }

    public isAllowed(level: ILevel): boolean {
        return Level.isAllowed(this.config.level!, level);
    }

    public format(value: any): string {
        return this.config.format!(value);
    }

    public getMessage(
        strings: TemplateStringsArray,
        expressions: any[],
        level: ILevel,
        location: string
    ): string {
        return this.config.template!({
            level: level,
            message: this.stringify(strings, expressions),
            date: new Date(),
            location: location,
        });
    }

    public stringify(strings: TemplateStringsArray, expressions: any[]): string {
        return strings.reduce((prev, curr, index) => {
            // NOTICE: This is the default format in the config, not the format in the template
            const formatted = this.format(expressions[index] || "");

            return `${prev}${curr}${formatted}`;
        }, "");
    }

    public abstract log(
        strings: TemplateStringsArray,
        expressions: any[],
        level: ILevel,
    ): any;
}

export default LoggerBase;
