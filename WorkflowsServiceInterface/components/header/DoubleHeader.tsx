"use client"
import cx from 'clsx';
import { useState } from 'react';
import {LightDark} from '../light-dark/LightDark';
import { useRouter } from 'next/navigation';
import {
  Container,
  Divider,
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
  Button, // Aggiunto l'import di Button
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
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
import { MantineLogo } from '@mantinex/mantine-logo';
import classes from './DoubleHeader.module.css';


const user = {
  name: 'Jane Spoonfighter',
  email: 'janspoon@fighter.dev',
  image: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-5.png',
};

const tabs = [
  { label: 'Home', path: '/' },
  { label: 'Upload', path: '/upload' },
];

interface SectionItem {
  label: string;
  path: string;
}

const siteSections: SectionItem[] = [
  { label: 'Home', path: '/' },
  { label: 'Upload', path: '/upload' },
];

// Per le voci dell'account, puoi decidere i percorsi in base alla tua app
const accountSections: SectionItem[] = [
  { label: 'Account settings', path: '/profilo' },
  { label: 'Change account', path: '/impostazioni' },
  { label: 'Logout', path: '/impostazioni' },
];

interface MenuItem {
  label: string;
}



export default function DoubleHeader() {
  const theme = useMantineTheme();
  const [opened, { toggle }] = useDisclosure(false);
  const [userMenuOpened, setUserMenuOpened] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Aggiunto stato per gestire l'autenticazione
  const router = useRouter();

  
  
  const [burgerOpen, setBurgerOpen] = useState(false);

  const handleTabClick = (path: string) => {
    router.push(path);
    setBurgerOpen(false); 
  };

  const handleAuthButtonClick = () => {
    setIsAuthenticated(true); // Cambia lo stato per simulare l'autenticazione
  };

  const items = tabs.map((tab) => (
    <Tabs.Tab value={tab.label} key={tab.label} onClick={() => handleTabClick(tab.path)}>
      {tab.label}
    </Tabs.Tab>
  ));

  return (
    <div id="header" className={classes.header}>
      <Container className={classes.mainSection} size="bg">
        <Group justify="space-between">
          <UnstyledButton onClick={() => handleTabClick('/')} title="Home">
            <MantineLogo size={28} />
          </UnstyledButton>

          
          
          <Group hiddenFrom="xs">
            <LightDark />
            <Burger opened={burgerOpen} onClick={() => setBurgerOpen((o) => !o)}  size="sm" title='burger'/>
            
            
          </Group>
          <Group visibleFrom='xs'>
          <LightDark />
          {!isAuthenticated && ( 
              <Group visibleFrom='xs'>
                <Button variant="outline" onClick={handleAuthButtonClick}>Login</Button>
                <Button variant="filled" color="blue" onClick={handleAuthButtonClick}>Signup</Button>
              </Group>
          )}
          {isAuthenticated && (
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
                    <Avatar src={user.image} alt={user.name} radius="xl" size={20} />
                    <Text fw={500} size="sm" lh={1} mr={3}>
                      {user.name}
                    </Text>
                    <IconChevronDown style={{ width: rem(12), height: rem(12) }} stroke={1.5} />
                  </Group>
                </UnstyledButton>
              </Menu.Target>
              <Menu.Dropdown visibleFrom='xs'>
                <Menu.Item
                  leftSection={
                    <IconFileAnalytics style={{ width: rem(16), height: rem(16) }} color={theme.colors.blue[6]} stroke={1.5} />
                  }
                  onClick={() => handleTabClick('/reports')}
                >
                  Your Reports
                </Menu.Item>
                <Menu.Label>Settings</Menu.Label>
                <Menu.Item
                  leftSection={
                    <IconSettings style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                  }
                  onClick={() => handleTabClick('/account')}
                >
                  Account settings
                </Menu.Item>
                <Menu.Item
                  leftSection={
                    <IconSwitchHorizontal style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                  }
                  onClick={() => handleTabClick('/changeAccount')}
                >
                  Change account
                </Menu.Item>
                <Menu.Item
                  leftSection={
                    <IconLogout style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                  }
                  onClick={() => setIsAuthenticated(false)} // Aggiunta azione per "Logout"
                >
                  Logout
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
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
          onClick={() => handleTabClick('/')}
        >
          Home
        </Menu.Item>
        <Menu.Item
          leftSection={
            <IconUpload style={{ width: rem(16), height: rem(16) }} color={theme.colors.blue[6]} stroke={1.5} />
          }
          onClick={() => handleTabClick('/upload')}
        >
          Upload
        </Menu.Item>
      
      {isAuthenticated && (
        <Menu>
          <Menu.Label>Account</Menu.Label>
          
          <Menu.Item
            leftSection={
              <IconFileAnalytics style={{ width: rem(16), height: rem(16) }} color={theme.colors.blue[6]} stroke={1.5} />
            }
            onClick={() => handleTabClick('/reports')}
          >
            Your Reports
          </Menu.Item>
          <Menu.Item
            leftSection={
              <IconSettings style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
            }
            onClick={() => handleTabClick('/account')}
          >
            Account settings
          </Menu.Item>
          <Menu.Item
            leftSection={
              <IconSwitchHorizontal style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
            }
            onClick={() => handleTabClick('/changeAccount')}
          >
            Change account
          </Menu.Item>
          <Menu.Item
            leftSection={
              <IconLogout style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
            }
            onClick={() => setIsAuthenticated(false)} // Aggiunta azione per "Logout"
          >
            Logout
          </Menu.Item>
        </Menu>
        )}
        <Divider />

        {!isAuthenticated && (
          <>
            <Menu.Label>Account</Menu.Label>
            <Menu.Item
              leftSection={
                <IconLogin  style={{ width: rem(16), height: rem(16) }} color={theme.colors.blue[6]} stroke={1.5} />
              }
              onClick={() => setIsAuthenticated(true)}
            >
              Login
            </Menu.Item>
            <Menu.Item
              leftSection={
                <IconUserPlus  style={{ width: rem(16), height: rem(16) }} color={theme.colors.blue[6]} stroke={1.5} />
              }
              onClick={() => setIsAuthenticated(true)}
            >
              Signup
            </Menu.Item>
          </>
        )}
        </Menu>
      </Collapse>

    </div>
    
  );
}
