# Fase 1: Costruire l'applicazione
FROM node:20-alpine AS builder

WORKDIR /app

# Copia i file package.json e package-lock.json
COPY package*.json ./

# Installa le dipendenze
RUN npm install

# Copia il resto del codice sorgente
COPY . .

# Costruisce l'applicazione
RUN npm run build

# Fase 2: Eseguire l'applicazione
FROM node:20-alpine

WORKDIR /app

# Installa 'at' e il demone 'atd'
RUN apk add --no-cache at openrc && rc-update add atd default

# Copia solo i file necessari dalla fase di build
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Copia lo script di avvio
COPY start.sh ./start.sh
RUN chmod +x ./start.sh

EXPOSE 3000

CMD ["./start.sh"]
