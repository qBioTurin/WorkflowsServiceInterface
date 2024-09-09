"use client";
import cx from 'clsx';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';  
import axios from 'axios';  
import {
  Container,
  Avatar,
  UnstyledButton,
  Group,
  Text,
  Menu,
  Tabs,
  Burger,
  rem,
  Collapse,
  useMantineTheme,
} from '@mantine/core';
import {
  IconFileAnalytics,
  IconLogout,
  IconUserPlus,
  IconLogin,
  IconHome,
  IconSettings,
  IconSwitchHorizontal,
  IconChevronDown,
  IconUpload,
} from '@tabler/icons-react';
import classes from './DoubleHeader.module.css';
import { useAuth } from '@/utils/auth'; 

const tabs:any = [];

interface HeaderProps {
  opened: boolean | undefined;
  toggle: () => void;
}

const DoubleHeader: React.FC<HeaderProps> = ({ opened, toggle }) => {
  const theme = useMantineTheme();
  
  const [burgerOpen, setBurgerOpen] = useState(false);
  const [userMenuOpened, setUserMenuOpened] = useState(false);
  
  const { user, logout, isAuthenticated } = useAuth();  

  const handleLogout = async () => {
    try {
      await axios.get('/api/logout');
      logout();  
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  useEffect(() => {
    console.log('User data updated:', user);
  }, [user]);

  const items = tabs.map((tab : any) => (
    <Tabs.Tab value={tab.label} key={tab.label}>
      <Link href={tab.path} passHref>
        <div onClick={() => setBurgerOpen(false)}>{tab.label}</div>
      </Link>
    </Tabs.Tab>
  ));

  return (
    <div id="header" className={classes.header}>
      <Container className={classes.mainSection} size="bg">
        <Group justify="space-between">
          <Link href="/" passHref>
            <UnstyledButton title="Home">
              <img src="/images/logo.jpg" alt="Home" width={280} height={25} />
            </UnstyledButton>
          </Link>

          <Group hiddenFrom="sm">
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          </Group>

          <Group visibleFrom="sm">
            {/* Se l'utente è autenticato, mostra il menu utente */}
            {isAuthenticated ? (
              <Menu
                width={260}
                position="bottom-end"
                transitionProps={{ transition: 'pop-top-right' }}
                onClose={() => setUserMenuOpened(false)}
                onOpen={() => setUserMenuOpened(true)}
                withinPortal
              >
                <Menu.Target>
                  <UnstyledButton className={cx(classes.user, { [classes.userActive]: userMenuOpened })}>
                    <Group gap={7}>
                      <Avatar src={user?.first_name} alt={user?.first_name} radius="xl" size={20} />
                      <Text fw={500} size="sm" style={{ lineHeight: '1' }} mr={3}>
                        {user?.first_name}
                      </Text>
                      <IconChevronDown style={{ width: rem(12), height: rem(12) }} stroke={1.5} />
                    </Group>
                  </UnstyledButton>
                </Menu.Target>
                <Menu.Dropdown visibleFrom="xs">
                  <Menu.Item
                    leftSection={
                      <IconFileAnalytics style={{ width: rem(16), height: rem(16) }} color={theme.colors.blue[6]} stroke={1.5} />
                    }
                  >
                    <Link href="/reports" passHref>Your Reports</Link>
                  </Menu.Item>
                  <Menu.Label>Settings</Menu.Label>
                  <Menu.Item
                    leftSection={
                      <IconSettings style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                    }
                  >
                    <Link href="/account" passHref>Account settings</Link>
                  </Menu.Item>
                  <Menu.Item
                    leftSection={
                      <IconSwitchHorizontal style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                    }
                  >
                    <Link href="/changeAccount" passHref>Change account</Link>
                  </Menu.Item>
                  <Menu.Item
                    leftSection={
                      <IconLogout style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                    }
                    onClick={handleLogout}  // Collega il logout alla chiamata API e contesto
                  >
                    Logout
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            ) : (
              // Se l'utente non è autenticato, mostra le opzioni di login/registrazione
              <Group visibleFrom="sm">
                <Link href="/" passHref className={classes.link}>Home</Link>
                <Link href="/upload" passHref className={classes.link}>Upload</Link>
                <Link href="/login" passHref className={classes.link}>Login</Link>
                <Link href="/signup" passHref className={classes.link}>Signup</Link>
              </Group>
            )}
          </Group>
        </Group>
      </Container>

      <Container size="md">
        <Tabs
          defaultValue="Home"
          variant="outline"
          visibleFrom="xs"
          classNames={{
            root: classes.tabs,
            list: classes.tabsList,
            tab: classes.tab,
          }}
        >
          <Tabs.List>{items}</Tabs.List>
        </Tabs>
      </Container>

      <Collapse in={burgerOpen} hiddenFrom="xs">
        <Menu>
          <Menu.Label>Areas</Menu.Label>
          <Menu.Item
            leftSection={
              <IconHome style={{ width: rem(16), height: rem(16) }} color={theme.colors.blue[6]} stroke={1.5} />
            }
          >
            <Link href="/" passHref>Home</Link>
          </Menu.Item>
          <Menu.Item
            leftSection={
              <IconUpload style={{ width: rem(16), height: rem(16) }} color={theme.colors.blue[6]} stroke={1.5} />
            }
          >
            <Link href="/upload" passHref>Upload</Link>
          </Menu.Item>

          {isAuthenticated && (
            <>
              <Menu.Label>Account</Menu.Label>
              <Menu.Item
                leftSection={
                  <IconFileAnalytics style={{ width: rem(16), height: rem(16) }} color={theme.colors.blue[6]} stroke={1.5} />
                }
              >
                <Link href="/reports" passHref>Your Reports</Link>
              </Menu.Item>
              <Menu.Item
                leftSection={
                  <IconSettings style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                }
              >
                <Link href="/account" passHref>Account settings</Link>
              </Menu.Item>
              <Menu.Item
                leftSection={
                  <IconSwitchHorizontal style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                }
              >
                <Link href="/changeAccount" passHref>Change account</Link>
              </Menu.Item>
              <Menu.Item
                leftSection={
                  <IconLogout style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                }
                onClick={handleLogout}
              >
                Logout
              </Menu.Item>
            </>
          )}

          {!isAuthenticated && (
            <>
              <Menu.Label>Account</Menu.Label>
              <Menu.Item
                leftSection={
                  <IconLogin style={{ width: rem(16), height: rem(16) }} color={theme.colors.blue[6]} stroke={1.5} />
                }
              >
                <Link href="/login" passHref>Login</Link>
              </Menu.Item>
              <Menu.Item
                leftSection={
                  <IconUserPlus style={{ width: rem(16), height: rem(16) }} color={theme.colors.blue[6]} stroke={1.5} />
                }
              >
                <Link href="/signup" passHref>Signup</Link>
              </Menu.Item>
            </>
          )}
        </Menu>
      </Collapse>
    </div>
  );
};

export default DoubleHeader;