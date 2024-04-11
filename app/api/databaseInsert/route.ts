import { error } from "console";
import pool from "../../../utils/database/database"

const fetchDataFromDatabase = async() => {
    try{
    const client = await pool.connect();
    console.log("Connessione al database effettuata");

    const result = await client.query("SELECT * FROM public.userS");
    const data = result.rows;
    console.log("Ecco i dati:", data);

    client.release();

    return data;
    }catch(error){
        console.error("Error:", error);
        throw error;
    }
}

fetchDataFromDatabase()
    .then(data => {
        console.log("Dati ricevuti:",data)
    })
    .catch(error=> {
        console.error("Errore:",error);
    })
