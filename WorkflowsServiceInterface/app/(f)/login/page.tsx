"use client"
import { useEffect } from 'react';
import { Container, Paper, Title, TextInput, Button,Center, Group,UnstyledButton, PasswordInput } from '@mantine/core';
import { IconAt, IconLock } from '@tabler/icons-react';
import { MantineLogo } from '@mantinex/mantine-logo';

import { useRouter } from 'next/navigation';

export default function Login() {

  
  const router = useRouter();


  const handleTabClick = (path: string) => {
    router.push(path);
  };

  return (
    <Container size={420} my={40}>
      {/* Centra il logo sopra la sezione di login */}
      <Center mb="xl">
        <UnstyledButton onClick={() => handleTabClick('/')} title="Home">
          <MantineLogo size={80} />
        </UnstyledButton>
      </Center>

      <Paper withBorder shadow="md" p={30} radius="md">
        <Title mb="lg">Login</Title>
        <TextInput
          leftSection={<IconAt />}
          label="Email"
          placeholder="you@example.com"
          required
        />
        <PasswordInput
          leftSection={<IconLock />}
          label="Password"
          placeholder="Your password"
          required
          mt="md"
        />
        <Group  mt="md">
          <Button variant="filled">Login</Button>
        </Group>
      </Paper>
    </Container>
  );
}
