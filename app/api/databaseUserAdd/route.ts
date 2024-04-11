import pool from "../../../utils/database/database"

const insertRandomUser = async () => {
  try {
    const client = await pool.connect();
    console.log("Connessione al database effettuata");

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

    console.log("Utente inserito:", result.rows[0]);

    client.release();

    return result.rows[0];
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

// Esecuzione della funzione per inserire un utente casuale
insertRandomUser()
  .then(user => {
    console.log("Utente casuale inserito:", user);
  })
  .catch(error => {
    console.error("Errore durante l'inserimento dell'utente casuale:", error);
  });
