import winston from 'winston'
import { config } from '../config/config.js';

const loggerPersonalizado = winston.createLogger(
    {
        levels: { debug: 5, http: 4, info: 3, warning: 2, error: 1, fatal: 0 },
        transports: []
    }
)


const archivoLogger = new winston.transports.File({
    level: "error",
    filename: "./src/logs/error.log",
    format: winston.format.json()
})

const archivoLoggerDev = new winston.transports.File({
    level: "error",
    filename: "./src/logs/errorDev.log",
    format: winston.format.json()
})
const loggerPersonalizadoDev = new winston.transports.Console({
    level: "debug",
    format: winston.format.combine(
        winston.format.colorize({
            colors: { debug: "blue", http: "cyan", info: "green", warning: "yellow", error: "magenta", fatal: "red" }
        }),
        winston.format.simple()
    )
})

const loggerPersonalizadoProd = new winston.transports.Console({
    level: "info",
    format: winston.format.combine(
        winston.format.colorize({
            colors: { debug: "blue", http: "cyan", info: "green", warning: "yellow", error: "magenta", fatal: "red" }
        }),
        winston.format.simple()
    )
})

if (config.MODE == "dev") {
    loggerPersonalizado.add(loggerPersonalizadoDev)
    loggerPersonalizado.add(archivoLoggerDev)

}

if (config.MODE == "prod") {
    loggerPersonalizado.add(loggerPersonalizadoProd)
    loggerPersonalizado.add(archivoLogger)

}

export const middLog = (req, res, next) => {
    req.logger = loggerPersonalizado
    next()
}