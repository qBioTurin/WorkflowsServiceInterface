"use client"
import { useEffect } from 'react';
import { Container, Paper, Title, TextInput, Button, Group, PasswordInput, Center,UnstyledButton, Select } from '@mantine/core';
import { IconUser, IconAt, IconLock, IconPhone, IconMapPin } from '@tabler/icons-react';
import { MantineLogo } from '@mantinex/mantine-logo'; // Assicurati di sostituire con il tuo componente logo se necessario
import { useRouter } from 'next/navigation';

export default function Registration() {
  // Opzionalmente, potresti voler caricare dinamicamente la lista dei paesi
  const countries = ['Country 1', 'Country 2', 'Country 3'];

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

  return (
    <Container size={420} my={40}>
      <Center mb="xl">
        <UnstyledButton onClick={() => handleTabClick('/')} title="Home">
          <MantineLogo size={80} />
        </UnstyledButton>
      </Center>

      <Paper withBorder shadow="md" p={30} radius="md">
        <Title mb="lg">Sign Up</Title>
        <TextInput
          leftSection={<IconUser />}
          label="First Name"
          placeholder="John"
          required
          mt="md"
        />
        <TextInput
          leftSection={<IconUser />}
          label="Last Name"
          placeholder="Doe"
          required
          mt="md"
        />
        <TextInput
          leftSection={<IconPhone />}
          label="Phone"
          placeholder="+123456789"
          required
          mt="md"
        />
        <Select
          leftSection={<IconMapPin />}
          label="Country"
          placeholder="Select your country"
          data={countries}
          required
          mt="md"
        />
        <TextInput
          leftSection={<IconAt />}
          label="Email"
          placeholder="you@example.com"
          required
          mt="md"
        />
        <PasswordInput
          leftSection={<IconLock />}
          label="Password"
          placeholder="Your password"
          required
          mt="md"
        />
        <Group  mt="md">
          <Button variant="filled">Register</Button>
        </Group>
      </Paper>
    </Container>
  );
}
