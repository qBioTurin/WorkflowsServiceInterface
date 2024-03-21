'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { Button, Container, Text, Title } from '@mantine/core';
type Props = {
    error: Error & { digest?: string };
    reset: VoidFunction;
};

export default function HomePageError({ error, reset }: Props): JSX.Element {
  
    return(
      <Container size="sm" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', textAlign: 'center' }}>
      <Title order={1}>Errore interno</Title>
      <Text size="lg" style={{ margin: '20px 0' }}>
        {error.message && error.message}
      </Text>
      <a href="/">
        <Button component="a" variant="filled" color="blue">
          Torna alla Home
      </Button>
      </a>
    </Container>
    );
}
