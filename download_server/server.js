const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Endpoint che restituisce un messaggio di benvenuto
app.get('/', (req, res) => {
    const filePath = path.join(__dirname, '../public/storage/utente1/provatxt-01-07-2024-f4ecb644-69d1-44bc-b84d-ce27face03f8/input/prova.txt');
    console.log("Apro questo file: " + filePath);
    res.download("."+filePath);
});

// Endpoint per il download dei file
app.post('/download', (req, res) => {
    const { caseId, filename } = req.body;
    const filePath = path.join(__dirname, '../public/storage', 'utente1', caseId, 'output', 'log.txt');
    console.log("Apro questo file: " + filePath);
    res.download("."+filePath); // Serve the file for downloading
});

// Ascolta sulla porta configurata
app.listen(3001, () => {
    console.log(`Download server running on port 3001`);
});
