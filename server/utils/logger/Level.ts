import {ILevel, levelsNumbers} from "./ILevel";

export class Level {
    protected static getLevelNumber = (lvl: ILevel) => {
        const result = levelsNumbers[lvl];

        return result === null || result === undefined ? 10 : result;
    };

    public static isAllowed = (expectedLevel: ILevel, level: ILevel) => {
        return this.getLevelNumber(level) <= this.getLevelNumber(expectedLevel);
    };
}