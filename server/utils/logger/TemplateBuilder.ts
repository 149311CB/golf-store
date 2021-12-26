interface IInfo {
    date: Date;
    level: string;
    message: string;
    location: string;
}

type Formatter = (info: IInfo) => string;

export default class TemplateBuilder {
    protected formatters: Formatter[] = [];

    public addDate = () => {
        this.formatters.push(({date}) => date.toLocaleDateString());
        return this;
    };
    public addLocation = () => {
        this.formatters.push(({location}) => location);
        return this;
    };
    public addMessage = () => {
        this.formatters.push(({message}) => message);
        return this;
    };
    public addText = (message: string) => {
        this.formatters.push(() => message);
        return this;
    };
    public addLevel = () => {
        this.formatters.push(({level}) => level.toUpperCase());
        return this;
    };
    public addNewLine = () => {
        this.formatters.push(() => "\n");
        return this;
    };

    public build = () => {
        return (info: any) => {
            return this.formatters.reduce((prev, curr) => {
                return `${prev}${curr(info)}`;
            }, "");
        };
    };
}

export {IInfo};