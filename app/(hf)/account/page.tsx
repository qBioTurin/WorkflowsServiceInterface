"use client"
import { Container, Title, Card, Text, TextInput, Button, Group, PasswordInput, Box } from '@mantine/core';
import { IconUser, IconLock, IconMail, IconPhone, IconHome, IconWorld } from '@tabler/icons-react';
import { useState } from 'react';
export default function AccountPage() {
  // Assumi che questi stati siano collegati ai valori dell'utente corrente
  const [email, setEmail] = useState('user@example.com');
  const [name, setName] = useState('Mario');
  const [surname, setSurname] = useState('Rossi');
  const [phone, setPhone] = useState('1234567890');
  const [country, setCountry] = useState('Italia');
  const [address, setAddress] = useState('Via Roma 1');

  // Aggiungi altri stati per la password, ecc...
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSaveChanges = () => {
    // Implementa la logica per salvare le modifiche
    console.log('Salva le modifiche');
  };

  return (
    <Container size="sm" my={40}>
      <Title order={1} mb="lg">Impostazioni Account</Title>

      <Card withBorder shadow="sm" p="lg" radius="md" mb="lg">
        <Text size="lg" mb="md">
          Informazioni Personali <IconUser size={20} />
        </Text>
        <TextInput 
          label="Nome" 
          placeholder="Il tuo nome" 
          value={name} 
          onChange={(event) => setName(event.currentTarget.value)}
          mb="md"
          leftSection={<IconUser />}
        />
        <TextInput 
          label="Cognome" 
          placeholder="Il tuo cognome" 
          value={surname} 
          onChange={(event) => setSurname(event.currentTarget.value)}
          mb="md"
          leftSection={<IconUser />}
        />
        <TextInput 
          label="Telefono" 
          placeholder="Il tuo numero di telefono" 
          value={phone} 
          onChange={(event) => setPhone(event.currentTarget.value)}
          mb="md"
          leftSection={<IconPhone />}
        />
        <TextInput 
          label="Paese" 
          placeholder="Il tuo paese" 
          value={country} 
          onChange={(event) => setCountry(event.currentTarget.value)}
          mb="md"
          leftSection={<IconWorld />}
        />
        <TextInput 
          label="Indirizzo" 
          placeholder="Il tuo indirizzo" 
          value={address} 
          onChange={(event) => setAddress(event.currentTarget.value)}
          mb="md"
          leftSection={<IconHome />}
        />
        <TextInput 
          label="Email" 
          placeholder="La tua email" 
          value={email} 
          onChange={(event) => setEmail(event.currentTarget.value)}
          mb="md"
          leftSection={<IconMail />}
        />
        <Button onClick={handleSaveChanges}>Salva Modifiche</Button>
      </Card>

      <Card withBorder shadow="sm" p="lg" radius="md" mb="lg">
        <Text size="lg" mb="md">
          Sicurezza <IconLock size={20} />
        </Text>
        <PasswordInput 
          label="Password attuale" 
          placeholder="Password attuale" 
          value={currentPassword}
          onChange={(event) => setCurrentPassword(event.currentTarget.value)}
          mb="md"
          leftSection={<IconLock />}
        />
        <PasswordInput 
          label="Nuova Password" 
          placeholder="Nuova Password" 
          value={newPassword}
          onChange={(event) => setNewPassword(event.currentTarget.value)}
          mb="md"
          leftSection={<IconLock />}
        />
        <PasswordInput 
          label="Conferma Nuova Password" 
          placeholder="Conferma Nuova Password" 
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.currentTarget.value)}
          mb="md"
          leftSection={<IconLock />}
        />
        <Button onClick={handleSaveChanges}>Cambia Password</Button>
      </Card>
    </Container>
  );
}
