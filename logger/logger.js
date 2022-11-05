import log4js from "log4js";

// log4js -> trace,debug,info,warn,error,fatal

log4js.configure({
    appenders: { // como guardo el output (archivo/consola)
        console: { type: 'console' },
        warnFile: { type: 'file', filename: 'warn.log' },
        errorFile: { type: 'file', filename: 'error.log' },
        loggerConsole: { type: 'logLevelFilter', appender: 'console', level: 'info' },
        loggerWarnFile: { type: 'logLevelFilter', appender: 'warnFile', level: 'warn' },
        loggerErrorFile: { type: 'logLevelFilter', appender: 'errorFile', level: 'error' }
    },
    categories: {
        default: { appenders: ['loggerConsole', 'loggerWarnFile', 'loggerErrorFile'], level: 'all' }
    }
})

const logger = log4js.getLogger('default');

export default logger