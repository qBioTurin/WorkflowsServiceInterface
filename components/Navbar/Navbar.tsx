import React from 'react';
import Link from 'next/link';
import { UnstyledButton, Button, Divider,Text } from '@mantine/core';
import classes from '@/components/header/DoubleHeader.module.css';
import { User } from '@/utils/models/user';
import { rem, useMantineTheme } from '@mantine/core';
import { IconFileAnalytics, IconLogout, IconSettings, IconSwitchHorizontal } from '@tabler/icons-react';
import { NavbarProps } from '@/utils/models/models';

const Navbar: React.FC<NavbarProps> = ({ user, handleLogout }) => {
  const theme = useMantineTheme();

  return (
    <nav>
      <Text>Le aree del sito</Text>
      <Link href="/" passHref legacyBehavior>
        <UnstyledButton className={classes.control}>Home</UnstyledButton>
      </Link>
      <Link href="/upload" passHref legacyBehavior>
        <UnstyledButton className={classes.control}>Upload</UnstyledButton>
      </Link>
      <Divider />
      <Text>Account</Text>
      {user ? (
        <>
          <Link href="/reports" passHref legacyBehavior>
            <UnstyledButton className={classes.control}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <IconFileAnalytics style={{ width: rem(16), height: rem(16), marginRight: rem(8) }} color={theme.colors.blue[6]} stroke={1.5} />
                Your Reports
              </div>
            </UnstyledButton>
          </Link>
          <Link href="/account" passHref legacyBehavior>
            <UnstyledButton className={classes.control}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <IconSettings style={{ width: rem(16), height: rem(16), marginRight: rem(8) }} color={theme.colors.blue[6]} stroke={1.5} />
                Account Settings
              </div>
            </UnstyledButton>
          </Link>
          <Link href="/changeAccount" passHref legacyBehavior>
            <UnstyledButton className={classes.control}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <IconSwitchHorizontal style={{ width: rem(16), height: rem(16), marginRight: rem(8) }} color={theme.colors.blue[6]} stroke={1.5} />
                Change Account
              </div>
            </UnstyledButton>
          </Link>
          <UnstyledButton className={classes.control}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <IconLogout style={{ width: rem(16), height: rem(16), marginRight: rem(8) }} color={theme.colors.blue[6]} stroke={1.5} />
              Logout
            </div>
          </UnstyledButton>
        </>
      ) : (
        <>
          <Link href="/login" passHref legacyBehavior>
            <Button variant="outline">Login</Button>
          </Link>
          <Link href="/signup" passHref legacyBehavior>
            <Button variant="filled" color="blue">Signup</Button>
          </Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;
