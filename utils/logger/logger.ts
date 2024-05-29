import * as winston from 'winston';

// Funzione per filtrare i log basati sul modulo e rimuovere le decorazioni non necessarie
const filterByModule = (module : string) => {
  return winston.format((info) => {
    return info.module === module ? info : false;
  })();
};

// Configura il logger con formati e trasporti specifici per modulo
const logger = winston.createLogger({
  format: winston.format.printf(info => `${info.level}: ${info.message}`), // Formato base per tutti i trasporti
  transports: [
    // Trasporto per log generali (senza filtro per modulo)
    new winston.transports.File({
      filename: 'logs/general.log'
    }),
    // Trasporto per log del database
    new winston.transports.File({
      filename: 'logs/database.log',
      level: 'info',
      format: winston.format.combine(
        filterByModule('database'),
        winston.format.json()  // Usa JSON per il formato dei log di database
      )
    }),
    // Trasporto per log dell'upload
    new winston.transports.File({
      filename: 'logs/upload.log',
      level: 'info',
      format: winston.format.combine(
        filterByModule('upload'),
        winston.format.json()  // Usa JSON per il formato dei log di upload
      )
    }),
    new winston.transports.File({
      filename: 'logs/cleanup.log',
      level: 'info',
      format: winston.format.combine(
        filterByModule('cleanup'),
        winston.format.json()  // Usa JSON per il formato dei log di upload
      )
    }),
    new winston.transports.File({
      filename: 'logs/download.log',
      level: 'info',
      format: winston.format.combine(
        filterByModule('download'),
        winston.format.json()  // Usa JSON per il formato dei log di upload
      )
    }),
  ]
});

export default logger;
