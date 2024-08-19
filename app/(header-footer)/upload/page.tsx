"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container } from '@mantine/core';
import AnalysisForm from '@/components/Upload/Form/AnalysisForm';
import SuccessAlert from '@/components/Upload/UploadSuccess/SuccessAlert';
import { User } from '@/utils/models/user';

export default function NewAnalysisPage() {
  const [uploadSuccess, setUploadSuccess] = useState<boolean | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Recupera l'utente dal localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        if (userData && typeof userData === 'object') {
          setUser(userData);
        } else {
          localStorage.removeItem('user');
          router.push('/login'); // Reindirizza al login se i dati non sono validi
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('user');
        router.push('/login'); // Reindirizza al login in caso di errore
      }
    } else {
      router.push('/login'); // Reindirizza al login se non c'è utente salvato
    }
  }, [router]);

  if (!user) {
    // Renderizza nulla se l'utente non è autenticato (verrà reindirizzato)
    return null;
  }

  return (
    <Container size="sm" my={40}>
      {uploadSuccess === null && (
        <AnalysisForm setUploadSuccess={setUploadSuccess} />
      )}
      {uploadSuccess && (
        <SuccessAlert handleReset={() => setUploadSuccess(null)} />
      )}
    </Container>
  );
}
