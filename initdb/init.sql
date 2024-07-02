-- Crea la tabella 'users' se non esiste
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    phone VARCHAR(15),
    country VARCHAR(50)
);

-- Inserisci alcuni utenti di esempio
INSERT INTO users (email, password_hash, first_name, last_name, phone, country)
VALUES
('user1@example.com', 'hash1', 'Nome1', 'Cognome1', '+390112223344', 'Italy'),
('user2@example.com', 'hash2', 'Nome2', 'Cognome2', '+390112223345', 'Italy'),
('user3@example.com', 'hash3', 'Nome3', 'Cognome3', '+390112223346', 'Italy');


CREATE TABLE IF NOT EXISTS workflows (
    workflow_id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    descrizione TEXT,
    url TEXT NOT NULL
);

-- Crea la tabella 'steps'
CREATE TABLE IF NOT EXISTS steps (
    step_id SERIAL PRIMARY KEY,
    workflow_id INTEGER NOT NULL,
    nome VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    descrizione TEXT,
    image TEXT,
    FOREIGN KEY (workflow_id) REFERENCES workflows(workflow_id)
);


INSERT INTO workflows (workflow_id,nome, descrizione, url) VALUES
(1,'Metagenome analysis', 'Questo è il workflow con 3 passi.', 'https://susmirri-test.di.unito.it/'),
(2,'Assembly ', 'Questo è il workflow con 1 passo.', 'https://susmirri-test.di.unito.it/workflowdue'),
(3,'Workflow Tre', 'Questo è il workflow due con più passi.', 'https://susmirri-test.di.unito.it/workflowdue'),
(4,'Workflow Quattro', 'Questo è il workflow due con più passi.', 'https://susmirri-test.di.unito.it/workflowdue');

INSERT INTO steps (workflow_id, nome, url, descrizione, image) VALUES
(1, 'STEP 1', 'https://susmirri-test.di.unito.it/passo1a', 'Data Pre-processing', '/images/metagenome_analysis_pre-processing.png'),
(1, 'STEP 2', 'https://susmirri-test.di.unito.it/passo1b', 'Taxonomic annotation', '/images/metagenome_analysis_taxonomic_annotation.png'),
(1, 'STEP 3', 'https://susmirri-test.di.unito.it/passo1b', 'Microbial characterization', '/images/metagenome_analysis_microbial_characterization.png'),
(2, 'STEP 1', 'https://susmirri-test.di.unito.it/passo2a', 'Assembly & Polishing', '/images/assembly.png'),
(3, 'Passo 3A', 'https://susmirri-test.di.unito.it/passo2a', 'Dettagli del passo 2A.', '/images/SUSMirri.png'),
(3, 'Passo 3B', 'https://susmirri-test.di.unito.it/passo2a', 'Dettagli del passo 2A.', '/images/SUSMirri.png'),
(3, 'Passo 3C', 'https://susmirri-test.di.unito.it/passo2a', 'Dettagli del passo 2A.', '/images/SUSMirri.png'),
(3, 'Passo 3D', 'https://susmirri-test.di.unito.it/passo2b', 'Dettagli del passo 2B.', '/images/SUSMirri.png'),
(3, 'Passo 3E', 'https://susmirri-test.di.unito.it/passo2c', 'Dettagli del passo 2C.', '/images/SUSMirri.png'),
(4, 'Passo 4A', 'https://susmirri-test.di.unito.it/passo2a', 'Dettagli del passo 2A.', '/images/SUSMirri.png'),
(4, 'Passo 4B', 'https://susmirri-test.di.unito.it/passo2a', 'Dettagli del passo 2A.', '/images/SUSMirri.png'),
(4, 'Passo 4C', 'https://susmirri-test.di.unito.it/passo2a', 'Dettagli del passo 2A.', '/images/SUSMirri.png'),
(4, 'Passo 4D', 'https://susmirri-test.di.unito.it/passo2b', 'Dettagli del passo 2B.', '/images/SUSMirri.png');

-- Concedi tutti i privilegi sulle tabelle all'utente 'postgres'
GRANT ALL PRIVILEGES ON TABLE users TO postgres;
GRANT ALL PRIVILEGES ON TABLE workflows TO postgres;
GRANT ALL PRIVILEGES ON TABLE steps TO postgres;