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
      <Footer/>
    </>
  );
}
