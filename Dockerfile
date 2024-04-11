# Fase 1: Costruire l'applicazione
FROM node:18.18.0-alpine AS builder

WORKDIR /WorkflowsServiceInterface

#aggiorna
RUN apk update

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

# Copia solo i file necessari dall'immagine di costruzione
COPY --from=builder /WorkflowsServiceInterface/node_modules ./node_modules
COPY --from=builder /WorkflowsServiceInterface/.next ./.next
COPY --from=builder /WorkflowsServiceInterface/public ./public
COPY --from=builder /WorkflowsServiceInterface/package.json ./package.json

EXPOSE 3000

CMD ["npm", "start"]
