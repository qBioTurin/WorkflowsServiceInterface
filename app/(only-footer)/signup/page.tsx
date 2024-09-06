'use client';
import { useState } from 'react';
import { Container, Paper, Title, TextInput, Button, Group, PasswordInput, Center, UnstyledButton } from '@mantine/core';
import { IconUser, IconAt, IconLock } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';

export default function RegistrationPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: email.split('@')[0], // Use email as base for username
          email,
          firstName,
          lastName,
          password,
        }),
      });

      if (response.ok) {
        alert('Registration successful');
        router.push('/login');
      } else {
        const result = await response.json();
        alert(`Registration failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Failed to register. Please try again.');
    }
  };

  return (
    <Container
      size={420}
      my={40}
      style={{
        backgroundColor: 'rgb(236, 233, 234)', // Colore dello sfondo
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <Center mb="xl">
        <UnstyledButton title="Home" onClick={() => router.push('/')}>
          <img src="/images/logo.jpg" alt="Home" width={280} height={25} />
        </UnstyledButton>
      </Center>
      <Paper withBorder shadow="md" p={30} radius="md">
        <Title style={{ textAlign: 'center' }} mb="lg">Sign Up</Title>
        <form onSubmit={handleSubmit}>
          <TextInput
            label="First Name"
            placeholder="John"
            leftSection={<IconUser size="1rem" />}
            value={firstName}
            onChange={(e) => setFirstName(e.currentTarget.value)}
            required
            mb="md"
          />
          <TextInput
            label="Last Name"
            placeholder="Doe"
            leftSection={<IconUser size="1rem" />}
            value={lastName}
            onChange={(e) => setLastName(e.currentTarget.value)}
            required
            mb="md"
          />
          <TextInput
            label="Email"
            placeholder="you@example.com"
            leftSection={<IconAt size="1rem" />}
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
            required
            mb="md"
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            rightSection={<IconLock size="1rem" />}
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
            required
            mb="md"
          />
          <Group mt="md">
            <Button
              type="submit"
              style={{
                backgroundColor: 'rgb(225, 146, 67)', // Colore del pulsante
              }}
            >
              Register
            </Button>
          </Group>
        </form>
      </Paper>
    </Container>
  );
}
