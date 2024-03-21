// app/page/not-found.page.tsx
"use client"
import { useEffect } from 'react';
import Link from 'next/link';
import { Button, Container, Text, Title } from '@mantine/core';

export default function NotFoundPage() {
  useEffect(() => {
    // Cerca gli elementi nel DOM e fai un'asserzione di tipo a HTMLElement
    const header = document.getElementById('header') as HTMLElement | null;
    const footer = document.getElementById('footer') as HTMLElement | null;

    // Se esistono, nascondili
    if (header) header.style.display = 'none';
    if (footer) footer.style.display = 'none';

    // Quando il componente viene smontato, ripristina la visualizzazione
    return () => {
      if (header) header.style.display = '';
      if (footer) footer.style.display = '';
    };
  }, []);

  return (
    <Container size="sm" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', textAlign: 'center' }}>
      <Title order={1}>404 - Pagina Non Trovata</Title>
      <Text size="lg" style={{ margin: '20px 0' }}>
        La pagina che stai cercando non esiste o è stata rimossa.
      </Text>
      <Link href="/" passHref>
        <Button component="a" variant="filled" color="blue">
          Torna alla Home
        </Button>
      </Link>
    </Container>
  );
}
