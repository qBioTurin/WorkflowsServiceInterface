'use client';
import { useState } from 'react';
import { Button, TextInput, PasswordInput, Container, Paper, Title, Center, Group, UnstyledButton } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { IconUser, IconLock } from '@tabler/icons-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        alert('Login successful');
        router.push('/');
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Failed to login. Please try again.');
    }
  };

  return (
    <Container
      size={420}
      my={40}
      style={{
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
        <Title style={{ textAlign: 'center' }} mb="lg">Login</Title>
        <TextInput
          label="Email"
          placeholder="you@example.com"
          leftSection={<IconUser size="1rem" />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <PasswordInput
          label="Password"
          placeholder="Your password"
          leftSection={<IconLock size="1rem" />}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          mt="md"
        />
        <Group mt="md">
          <Button
            type="submit"
            onClick={handleLogin}
            style={{
              backgroundColor: 'rgb(225, 146, 67)', // Colore del pulsante
            }}
          >
            Login
          </Button>
        </Group>
      </Paper>
    </Container>
  );
}
