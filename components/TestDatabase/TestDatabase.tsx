"use client"
import React, { useState, useEffect } from 'react';
import { User } from '@/utils/models/user'; 

export default function TestDatabase() {

    
    async function handleInsert (){
        const response = await fetch('/api/databaseInsert', { method: 'POST' });
        const data = await response.json();
        console.log(data);
    };

    function handleSelect() {
        fetch('/api/databaseSelect', { method: 'POST' }) // Assicurati che il metodo sia corretto
          .then(response => response.json())
          .then(result => {
            if (result && Array.isArray(result.data)) {
              setSelectResults(result.data); // Aggiorna lo stato con l'array all'interno dell'oggetto
              console.log("Dati ricevuti:", result.data);
            } else {
              console.error("La risposta non contiene un array 'data'");
              setSelectResults([]); // Resetta o gestisci come appropriato
            }
          })
          .catch(error => {
            console.error("Errore durante il recupero dei dati:", error);
          });
      }

    const [selectResults, setSelectResults] = useState<User[]>([]); // Usa l'interfaccia User per tipizzare gli elementi dell'array
    
    return (
        <div>
            <button onClick={handleInsert}>Test Insert</button>
            <button onClick={handleSelect}>Test Select</button>
            <ul>
                {selectResults.map((result, index) => (
                <li key={index}>
                    <strong>Username:</strong> {result.first_name} <br />
                    <strong>Email:</strong> {result.email} <br />
                    <strong>Name:</strong> {result.first_name} {result.last_name} <br />
                    <strong>Date of Birth:</strong> {new Date(result.last_name).toLocaleDateString()}
                </li>
                ))}
            </ul>
        </div>
    );
}
