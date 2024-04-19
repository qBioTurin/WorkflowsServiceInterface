"use client"
import { Welcome } from '../components/Welcome/Welcome';
import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';

import { ArticlesCardsGrid } from '../components/Applicazioni/ArticlesCardsGrid';
import DoubleHeader from '../components/header/DoubleHeader';
import Footer from '@/components/footer/Footer';
import React, { useState, useEffect } from 'react';

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  date_of_birth: string; // o Date, a seconda di come gestisci le date
}
export default function HomePage() {
  const [testError, setTestError] = useState(false);
  const [selectResults, setSelectResults] = useState<User[]>([]); // Usa l'interfaccia User per tipizzare gli elementi dell'array

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


  if (testError) throw new Error('test error.tsx');
  return (
    <>
      <DoubleHeader/>
      <ArticlesCardsGrid/>
      <button
                onClick={() => {
                    setTestError(true);
                }}
            >
                Error
            </button>
      <button onClick={handleInsert}>Test Insert</button>
      <button onClick={handleSelect}>Test Select</button>
      <ul>
        {selectResults.map((result, index) => (
          <li key={index}>
            <strong>Username:</strong> {result.username} <br />
            <strong>Email:</strong> {result.email} <br />
            <strong>Name:</strong> {result.first_name} {result.last_name} <br />
            <strong>Date of Birth:</strong> {new Date(result.date_of_birth).toLocaleDateString()}
          </li>
        ))}
      </ul>
      <Footer/>
    </>
  );
}
