"use client"
import { useState } from 'react';
import { Container, Paper, Title, TextInput, Button, Center, Group, UnstyledButton, PasswordInput } from '@mantine/core';
import { IconAt, IconLock } from '@tabler/icons-react';
import { MantineLogo } from '@mantinex/mantine-logo';
import { useRouter } from 'next/navigation';
import { _getUserByEmailAndPassword } from '@/utils/database/UserService';

export default function Login() {
  const router = useRouter();

  // State for email and password
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleTabClick = (path: string) => {
    router.push(path);
  };

  const handleSubmit = (async (event: React.FormEvent) => {
    event.preventDefault(); // Prevent the default form submission behavior

    try {
      const user = await _getUserByEmailAndPassword(email, password);

      if (user) {
        alert("si gode!")
        console.log('Login successful:', user);
        localStorage.setItem('user', JSON.stringify(user)); 
        router.push('/'); 
      } else {
        alert('Login failed: Invalid credentials'); // Simple error handling
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed');
    }
  });

  return (
    <Container size={420} my={40}>
      <Center mb="xl">
        <UnstyledButton onClick={() => handleTabClick('/')} title="Home">
          <MantineLogo size={80} />
        </UnstyledButton>
      </Center>

      <Paper withBorder shadow="md" p={30} radius="md">
        <Title mb="lg">Login</Title>
        <form onSubmit={handleSubmit}>
          <TextInput
            leftSection={<IconAt />}
            label="Email"
            placeholder="you@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <PasswordInput
            leftSection={<IconLock />}
            label="Password"
            placeholder="Your password"
            required
            mt="md"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Group mt="md">
            <Button type="submit" variant="filled">Login</Button>
          </Group>
        </form>
      </Paper>
    </Container>
  );
}
