export enum LogLevel {
    DEBUG = 10,
    INFO = 20,
    WARN = 30,
    ERROR = 40,
    OFF = 999,
}

let currentLogLevel: LogLevel = LogLevel.INFO;

export function setLogLevel(level: LogLevel): void {
    currentLogLevel = level;
}

export function getLogLevel(): LogLevel {
    return currentLogLevel;
}

export function setLogLevelByName(level: string): void {
    const normalized = level.trim().toUpperCase();
    switch (normalized) {
        case 'DEBUG':
            setLogLevel(LogLevel.DEBUG);
            return;
        case 'INFO':
            setLogLevel(LogLevel.INFO);
            return;
        case 'WARN':
        case 'WARNING':
            setLogLevel(LogLevel.WARN);
            return;
        case 'ERROR':
            setLogLevel(LogLevel.ERROR);
            return;
        case 'OFF':
        case 'NONE':
            setLogLevel(LogLevel.OFF);
            return;
        default:
            // Keep current level when input is invalid.
            return;
    }
}

function shouldLog(level: LogLevel): boolean {
    return level >= currentLogLevel && currentLogLevel !== LogLevel.OFF;
}

export function logDebug(...args: unknown[]): void {
    if (!shouldLog(LogLevel.DEBUG)) return;
    console.log(...args);
}

export function logInfo(...args: unknown[]): void {
    if (!shouldLog(LogLevel.INFO)) return;
    console.info(...args);
}

export function logWarn(...args: unknown[]): void {
    if (!shouldLog(LogLevel.WARN)) return;
    console.warn(...args);
}

export function logError(...args: unknown[]): void {
    if (!shouldLog(LogLevel.ERROR)) return;
    console.error(...args);
}

