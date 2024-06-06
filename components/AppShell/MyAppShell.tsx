"use client"
import { useState, useEffect, use } from 'react';
import { AppShell, Burger, Group, UnstyledButton, Button, Avatar, Menu,rem, Divider, Text, useMantineTheme } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { User } from '@/utils/models/user.js';
import Navbar from '@/components/Navbar/Navbar';
import DoubleHeader from '@/components/header/DoubleHeader';




export default function RootLayout({ children } : { children: React.ReactNode }) {
  const theme = useMantineTheme();
  const [opened, { toggle }] = useDisclosure();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        if (userData && typeof userData === 'object') {
          setUser(userData);
        } else {
          localStorage.removeItem('user');
        }
      } catch {
        localStorage.removeItem('user');
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: '50vw', breakpoint: 'sm', collapsed: { desktop: true, mobile: !opened } }}
      padding="md"
      styles={{
        root:{backgroundColor:"#ECE9EA"},
        header:{backgroundColor:"#ECE9EA"},
        navbar:{backgroundColor:"#ECE9EA"},
        main:{backgroundColor:"#ECE9EA",
              color:"#252d29"
        },
      }
      }
    >
      <AppShell.Header>
        <DoubleHeader opened={opened} toggle={toggle}/>
      </AppShell.Header>

      <AppShell.Navbar py="sm" px={4}>
        <Navbar user={user} handleLogout={handleLogout}/>
      </AppShell.Navbar>

      <AppShell.Main>
        <main>{children}</main>
      </AppShell.Main>
    </AppShell>
  );
}

