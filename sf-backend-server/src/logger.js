require('dotenv').config(); 
const { createLogger, format, transports } = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');


const customLevels = {
  levels: {
    critical: 0,
    error: 1,
    warn: 2,
    info: 3,
    debug: 4,
    silly:5
  },
  colors: {
    critical: 'red',
    error: 'red',
    warn: 'yellow',
    info: 'green',
    debug: 'blue',
    silly: 'white'
  }
};

const logger = createLogger({
  levels: customLevels.levels,
  level: 'info', // Set the default log level
  format: format.combine(
    //format.colorize({ all: true }),
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`)
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'app.log' }),
    new transports.File({ filename: 'error.log', level: 'error' }),
    new DailyRotateFile({ filename: 'studioLear-%DATE%.log',  datePattern: 'YYYY-MM-DD',  zippedArchive: true, maxSize: '20m', maxFiles: '14d' })
  ]
});

//winston.addColors(customLevels.colors);

module.exports = logger;
