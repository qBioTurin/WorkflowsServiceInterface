"use server"
import pool from "../../../utils/database/database"
import type { NextApiRequest, NextApiResponse } from 'next';
import { NextRequest, NextResponse } from 'next/server';
import logger from '../../../utils/logger/logger';

async function insertRandomUser() {
  try {
    const client = await pool.connect();
    logger.info("Connessione al database effettuata", { module: 'database' });

    // Generazione di valori casuali per l'inserimento
    const username = `user${Math.floor(Math.random() * 1000)}`;
    const email = `${username}@example.com`;
    const password_hash = `hash${Math.floor(Math.random() * 1000)}`;
    const first_name = `Nome${Math.floor(Math.random() * 100)}`;
    const last_name = `Cognome${Math.floor(Math.random() * 100)}`;
    const date_of_birth = `19${Math.floor(Math.random() * 90 + 10)}-${Math.floor(Math.random() * 12 + 1)}-${Math.floor(Math.random() * 28 + 1)}`;

    // Query per l'inserimento di un nuovo utente con valori casuali
    const queryText = 'INSERT INTO users(username, email, password_hash, first_name, last_name, date_of_birth) VALUES($1, $2, $3, $4, $5, $6) RETURNING *';
    const values = [username, email, password_hash, first_name, last_name, date_of_birth];
    const result = await client.query(queryText, values);

    logger.info("Utente inserito", { user: result.rows[0], module: 'database' });

    client.release();

    return result.rows[0];
  } catch (error) {
    logger.error("Error durante il recupero dati dal database", { error: error, module: 'database' });
    throw error;
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await insertRandomUser();
    logger.info("Utente casuale inserito", { user: user, module: 'database' });
    return NextResponse.json({ success: true, user });
  } catch (error) {
    logger.error("Errore durante l'inserimento dell'utente casuale", { error: error, module: 'database' });
    return NextResponse.json({ success: false, error: "Errore durante l'inserimento dell'utente casuale" });
  }
}
