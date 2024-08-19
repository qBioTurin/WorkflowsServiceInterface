// login.tsx

'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, TextInput, Group, Container, Paper, Title, Center, UnstyledButton, PasswordInput } from '@mantine/core';
import axios from 'axios';
import { IconUser, IconAt, IconLock } from '@tabler/icons-react';
import { MantineLogo } from '@mantinex/mantine-logo';
import { useAuth } from '@/utils/auth';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('/api/login', { email, password });
      const { accessToken } = response.data;
      const userData = { email }; // Consider saving more user details as needed

      login(userData);  // Update the context with the user data
      localStorage.setItem('accessToken', accessToken);  // Save the token

      alert('Login successful');
      router.push('/');  // Redirect to the home page

    } catch (error) {
      console.error('Login error:', error);
      alert('Failed to login. Please try again.');
    }
  };

  return (
    <Container size={420} my={40}>
      <Center mb="xl">
        <UnstyledButton onClick={() => router.push('/')} title="Home">
          <MantineLogo size={80} />
        </UnstyledButton>
      </Center>
      <Paper withBorder shadow="md" p={30} radius="md">
        <Title mb="lg">Login</Title>
        <TextInput
          label="Email"
          placeholder="you@example.com"
          leftSection={<IconUser />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <PasswordInput
          label="Password"
          placeholder="Your password"
          leftSection={<IconLock />}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          mt="md"
        />
        <Group mt="md">
          <Button type="submit" onClick={handleLogin}>Login</Button>
        </Group>
      </Paper>
    </Container>
  );
}
