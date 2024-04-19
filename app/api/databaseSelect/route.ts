"use server"
import pool from "../../../utils/database/database"
import { NextRequest, NextResponse } from 'next/server';

import logger from '../../../utils/logger/logger';

async function fetchDataFromDatabase (){
    try{
        const client = await pool.connect();
        logger.info("Connessione al database effettuata", { module: 'database' });

        const result = await client.query("SELECT * FROM users");
        const data = result.rows;
        logger.info("Ecco i dati:", data, { module: 'database' });

        client.release();

        return data;
    }catch(error){
        logger.error("Error durante il recupero dati dal database:", error);
        throw error;
    }
}
export async function POST(req: NextRequest) {
    try {
        const data = await fetchDataFromDatabase();
        logger.info("Dati ricevuti:", data, { module: 'database' });
        return NextResponse.json({ success: true, data });
    } catch (error) {
        logger.error("Errore durante il recupero dei dati:", error, { module: 'database' });
        return NextResponse.json({ success: false, error: "Errore durante il recupero dei dati" });
    }
}

