"use client"
import { Welcome } from '../components/Welcome/Welcome';
import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';
import { ArticlesCardsGrid } from '../components/Applicazioni/ArticlesCardsGrid';
import React from 'react';
import DoubleHeader from '../components/header/DoubleHeader';
import { useState } from 'react';
import Footer from '@/components/footer/Footer';

export default function HomePage() {
  const [testError, setTestError] = useState(false);

  // Funzione per chiamare l'API di inserimento
const handleInsert = async () => {
  const response = await fetch('/api/insert', { method: 'POST' });
  const data = await response.json();
  console.log(data);
};

// Funzione per chiamare l'API di selezione
const handleSelect = async () => {
  const response = await fetch('/api/select', { method: 'GET' });
  const data = await response.json();
  console.log(data);
};

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
      <Footer/>
    </>
  );
}
