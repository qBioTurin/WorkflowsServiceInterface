"use client"

import { useState } from 'react';
import { Container, Paper, Title, TextInput, Button, Group, PasswordInput, Center, UnstyledButton } from '@mantine/core';
import { IconUser, IconAt, IconLock } from '@tabler/icons-react';
import { MantineLogo } from '@mantinex/mantine-logo';
import { useRouter } from 'next/navigation';

export default function Registration() {
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
          username: email.split('@')[0], // Lo username è basato sull'email
          email,
          firstName,
          lastName,
          password,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert('Registration successful');
        router.push('/login'); 
      } else {
        alert(`Registration failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Failed to register. Please try again.');
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
        <Title mb="lg">Sign Up</Title>
        <form onSubmit={handleSubmit}>
          <TextInput
            leftSection={<IconUser />}
            label="First Name"
            placeholder="John"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <TextInput
            leftSection={<IconUser />}
            label="Last Name"
            placeholder="Doe"
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Group mt="md">
            <Button type="submit" variant="filled">Register</Button>
          </Group>
        </form>
      </Paper>
    </Container>
  );
}
