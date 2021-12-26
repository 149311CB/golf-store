enum levels {
    alert = "alert",
    crit = "crit",
    error = "error",
    warning = "warning",
    notice = "notice",
    info = "info",
    debug = "debug",
}

export const levelsNumbers = {
    [levels.alert]: 1,
    [levels.crit]: 2,
    [levels.error]: 3,
    [levels.warning]: 4,
    [levels.notice]: 5,
    [levels.info]: 6,
    [levels.debug]: 7,
};
export type ILevel = keyof typeof levels;