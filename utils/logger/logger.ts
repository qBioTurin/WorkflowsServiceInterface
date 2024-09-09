import * as winston from 'winston';

const filterByModule = (module: string) => {
  return winston.format((info) => {
    return info.module === module ? info : false;
  })();
};

const logger = winston.createLogger({
  format: winston.format.printf(info => `${info.level}: ${info.message}`), // Base format for all transports
  transports: [
    new winston.transports.File({
      filename: 'logs/general.log'
    }),
    new winston.transports.File({
      filename: 'logs/database.log',
      level: 'info',
      format: winston.format.combine(
        filterByModule('database'),
        winston.format.json()
      )
    }),
    new winston.transports.File({
      filename: 'logs/upload.log',
      level: 'info',
      format: winston.format.combine(
        filterByModule('upload'),
        winston.format.json()
      )
    }),
    new winston.transports.File({
      filename: 'logs/cleanup.log',
      level: 'info',
      format: winston.format.combine(
        filterByModule('cleanup'),
        winston.format.json()
      )
    }),
    new winston.transports.File({
      filename: 'logs/download.log',
      level: 'info',
      format: winston.format.combine(
        filterByModule('download'),
        winston.format.json()
      )
    }),
  ]
});

export default logger;
