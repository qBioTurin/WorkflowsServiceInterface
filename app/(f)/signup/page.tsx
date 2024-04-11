"use client"
import { useEffect } from 'react';
import { useState } from 'react';
import { Container, Paper, Title, TextInput, Button, Group, PasswordInput, Center,UnstyledButton, Select } from '@mantine/core';
import { IconUser, IconAt, IconLock, IconPhone, IconMapPin } from '@tabler/icons-react';
import { MantineLogo } from '@mantinex/mantine-logo'; // Assicurati di sostituire con il tuo componente logo se necessario
import { useRouter } from 'next/navigation';

export default function Registration() {
  // Opzionalmente, potresti voler caricare dinamicamente la lista dei paesi
  const countries = ['Country 1', 'Country 2', 'Country 3'];
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const router = useRouter();

  useEffect(() => {
    const header = document.getElementById('header') as HTMLElement | null;
    if (header) header.style.display = 'none';

    return () => {
      if (header) header.style.display = '';
    };
  }, []);

  const handleTabClick = (path: string) => {
    router.push(path);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Previene il comportamento di default del form
  
    // Invio dei dati alla tua API
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ firstName, lastName, phone, country, email, password }),
    });
  
    if (response.ok) {
      // Gestione della risposta di successo, ad esempio reindirizzamento alla pagina di login
      router.push('/login');
    } else {
      // Gestione degli errori
      alert('Failed to register');
    }
  };

  return (
    <Container size={420} my={40}>
      <Center mb="xl">
        <UnstyledButton onClick={() => handleTabClick('/')} title="Home">
          <MantineLogo size={80} />
        </UnstyledButton>
      </Center>
  
      <Paper withBorder shadow="md" p={30} radius="md">
        <Title mb="lg">Sign Up</Title>
  
        {/* Aggiungi il tag form qui con l'evento onSubmit */}
        <form onSubmit={handleSubmit}>
          <TextInput
            leftSection={<IconUser />}
            label="First Name"
            placeholder="John"
            required
            mt="md"
            value={firstName}
            onChange={(e) => setFirstName(e.currentTarget.value)}
          />
          <TextInput
            leftSection={<IconUser />}
            label="Last Name"
            placeholder="Doe"
            required
            mt="md"
            value={lastName}
            onChange={(e) => setLastName(e.currentTarget.value)}
          />
          <TextInput
            leftSection={<IconPhone />}
            label="Phone"
            placeholder="+123456789"
            required
            mt="md"
            value={phone}
            onChange={(e) => setPhone(e.currentTarget.value)}
          />
          <Select
            leftSection={<IconMapPin />}
            label="Country"
            placeholder="Select your country"
            data={countries}
            required
            mt="md"
            value={country}
            onChange={(value) => setCountry(value!)}
          />
          <TextInput
            leftSection={<IconAt />}
            label="Email"
            placeholder="you@example.com"
            required
            mt="md"
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
          />
          <PasswordInput
            leftSection={<IconLock />}
            label="Password"
            placeholder="Your password"
            required
            mt="md"
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
          />
  
          <Group mt="md">
            {/* Modifica il bottone per essere di tipo submit */}
            <Button type="submit" variant="filled">Register</Button>
          </Group>
        </form>
      </Paper>
    </Container>
  );
  
}
