# Fase 1: Costruire l'applicazione
FROM node:18.18.0-alpine AS builder

WORKDIR /WorkflowsServiceInterface

# Aggiorna e installa 'at'
RUN apk update && apk add at

# Copia solo i file necessari per l'installazione delle dipendenze
COPY package*.json ./

# Installa dipendenze e pulisce la cache per ridurre la dimensione dell'immagine
RUN npm ci --production && npm cache clean --force

# Copia il resto del codice sorgente
COPY . .

# Costruisce l'applicazione
RUN npm run build

# Fase 2: Eseguire l'applicazione
FROM node:18.18.0-alpine AS runner

WORKDIR /app

# Installa 'at' e il demone 'atd'
RUN apk update && apk add at openrc && rc-update add atd boot

# ho sostituito i vari copy con un install per evitare conflittualità
#RUN npm install

COPY --from=builder /WorkflowsServiceInterface/node_modules ./node_modules
COPY --from=builder /WorkflowsServiceInterface/.next ./.next
COPY --from=builder /WorkflowsServiceInterface/public ./public
COPY --from=builder /WorkflowsServiceInterface/package.json ./package.json

# Copia lo script di avvio
COPY start.sh ./start.sh
RUN chmod +x ./start.sh

EXPOSE 3000

CMD ["./start.sh"]
