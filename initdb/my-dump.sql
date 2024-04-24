-- Crea la tabella 'users' se non esiste
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    date_of_birth DATE
);

-- Inserisci alcuni utenti di esempio
INSERT INTO users (username, email, password_hash, first_name, last_name, date_of_birth)
VALUES
('user1', 'user1@example.com', 'hash1', 'Nome1', 'Cognome1', '1990-01-01'),
('user2', 'user2@example.com', 'hash2', 'Nome2', 'Cognome2', '1992-02-02'),
('user3', 'user3@example.com', 'hash3', 'Nome3', 'Cognome3', '1994-03-03');
