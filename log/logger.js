
const winston = require('winston');

require('winston-daily-rotate-file');
const log_directory = process.env.LOG_DIR || './logs'

const myTransport = new winston.transports.DailyRotateFile({
    filename: `${log_directory}/%DATE%-armsorter.log`,
    datePattern: 'DD-MM-YYYY',
    frequency: '24h',
    maxFiles: '90d'
})

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.timestamp({
            format: 'DD/MM/YYYY hh:mm:ss A',
        }),
        winston.format.align(),
        winston.format.printf((info) => `[${info.timestamp}] ${info.level}:${info.message}`)
    ),
    transports: [
        new winston.transports.File({
            filename: `${log_directory}/error.log`,
            level: 'error'
        }),
        myTransport
    ]
})

module.exports = logger;