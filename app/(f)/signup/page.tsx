"use client"

import { useEffect, useState } from 'react';
import { Container, Paper, Title, TextInput, Button, Group, PasswordInput, Center, UnstyledButton, Select } from '@mantine/core';
import { IconUser, IconAt, IconLock, IconPhone, IconMapPin } from '@tabler/icons-react';
import { MantineLogo } from '@mantinex/mantine-logo';
import { useRouter } from 'next/navigation';
import { _addUser } from '@/utils/database/UserService';
import { User } from '@/utils/models/user';

export default function Registration() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const countries = ['Country 1', 'Country 2', 'Country 3'];

  useEffect(() => {
    const header = document.getElementById('header');
    if (header) header.style.display = 'none';

    return () => {
      if (header) header.style.display = '';
    };
  }, []);

  const handleTabClick = (path: string) => {
    router.push(path);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const user: User = {  
      id:1,
      email,
      password_hash: password, // In production, hash the password before storing it
      first_name: firstName,
      last_name: lastName,
      phone,
      country,
    };

    try {
      const newUser = await _addUser(user);

      alert('Registration successful');
      localStorage.setItem('user', JSON.stringify(newUser));
      router.push('/');
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
            leftSection={<IconPhone />}
            label="Phone"
            placeholder="+123456789"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <Select
            leftSection={<IconMapPin />}
            label="Country"
            placeholder="Select your country"
            data={countries}
            required
            mt="md"
            value={country}
            onChange={(value) => {
              if (value === null) {
                setCountry(""); // Set to empty string or some default value if null
              } else {
                setCountry(value);
              }
            }}
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
