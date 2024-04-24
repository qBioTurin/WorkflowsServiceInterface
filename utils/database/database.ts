import { Pool } from 'pg';

const pool = new Pool({
    host: "postgres",  // Usa il nome del servizio Docker come host
    port: 5432,        // La porta standard di PostgreSQL
    user: "postgres",  // L'utente definito nel tuo docker-compose.yml
    password: "passwordIdronight",  // La password definita nel tuo docker-compose.yml
    database: "postgres"  // Il nome del database definito nel tuo docker-compose.yml
});

export default pool;
