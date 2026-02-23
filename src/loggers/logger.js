import winston from "winston";
import __dirname from "../utils/dirname.js";


/* Winston con configuración de niveles y loggers dinámicos 
Reglas profesionales
logger.info() → acciones exitosas, información relevante.
logger.warn() → advertencias, inputs inválidos, situaciones que no rompen la app.
logger.error() → errores que afectan la ejecución o generan fallos.
logger.http() → opcional para loguear cada request HTTP si hacés middleware.
*/
const customLevels = {
    levels: {
        error: 0,
        warn: 1,
        info: 2,
        http: 3,
    },
    colors: {
        error: "red",
        warn: "yellow",
        info: "blue",
        http: "magenta",
    },
};

winston.addColors(customLevels.colors);

const logger = winston.createLogger({
    levels: customLevels.levels,
    level: "info",
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            ),
        }),
        new winston.transports.File({
            filename: `${__dirname}/../loggers/errors.log`, // ruta absoluta
            level: 'warn',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            )
        })
    ],
});

export default logger;