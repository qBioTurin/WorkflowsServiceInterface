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

# Installa 'at', il demone 'atd', 'openssh-client'
RUN apk add --no-cache at openrc openssh-client && rc-update add atd default

# Copia solo i file necessari dalla fase di build
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Aggiungi il server remoto agli host conosciuti
RUN mkdir -p /root/.ssh && \
    for i in {1..5}; do ssh-keyscan -H 130.192.212.55 >> /root/.ssh/known_hosts && break || sleep 5; done


# Copia l'entrypoint script e rendilo eseguibile
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Copia lo script di avvio
COPY start.sh ./start.sh
RUN chmod +x ./start.sh

EXPOSE 3000

ENTRYPOINT ["/entrypoint.sh"]
CMD ["./start.sh"]
