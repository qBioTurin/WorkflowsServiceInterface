#!/bin/sh

# Imposta i permessi corretti per le chiavi SSH
chmod 600 /root/.ssh/id_rsa
chmod 644 /root/.ssh/id_rsa.pub
chmod 700 /root/.ssh

# Esegui il comando principale del container
exec "$@"
