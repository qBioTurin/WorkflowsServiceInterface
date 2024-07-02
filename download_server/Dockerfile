# Partendo dalla stessa base di Node
FROM node:20-alpine

# Crea la directory di lavoro
WORKDIR /app

# Copia i file di configurazione e installa le dipendenze
COPY ./package*.json ./
RUN npm install

# Copia il resto dei file sorgente
COPY ./ .

# Espone la porta su cui il server di download ascolterà
EXPOSE 3001

COPY server.js ./server.js

# Comando per avviare il server di download
CMD ["node", "server.js"]
