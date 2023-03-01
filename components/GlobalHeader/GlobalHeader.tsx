import AddIcon from '@mui/icons-material/Add';
import MenuIcon from '@mui/icons-material/Menu';
import { useTheme } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import IconButton from '@mui/material/IconButton';
import DarkModeSwitch from 'components/DarkModeSwitch';
import useAuth from 'hooks/context/useAuth';
import useColorMode from 'hooks/context/useColorMode';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { PRIMARY_SHADOW } from 'theme/shadows';

import GlobalHeaderDrawer from './GlobalHeaderDrawer';
import HeaderLink from './HeaderLink';

export const GLOBAL_HEADER_HEIGHT = 50;

const GlobalHeader = () => {
  const router = useRouter();
  const theme = useTheme();

  const { user } = useAuth();
  const { colorMode, setColorMode } = useColorMode();

  const [menuOpen, setMenuOpen] = useState(false);

  const openMenu = () => setMenuOpen(true);

  const closeMenu = () => setMenuOpen(false);

  const handleDarkModeSwitchChange = (checked: boolean) => {
    setColorMode(checked ? 'dark' : 'light');
  };

  const handleAvatarClick = () => router.push(`/user/${user?._id}`);

  return (
    <>
      <Box
        component="header"
        display="flex"
        justifyContent="space-between"
        boxShadow={PRIMARY_SHADOW}
        height={GLOBAL_HEADER_HEIGHT}
        px={2}
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          bgcolor: theme.palette.paper?.main,
        }}
      >
        <Box display="flex" alignItems="center" ml={-1}>
          <IconButton onClick={openMenu}>
            <MenuIcon />
          </IconButton>
        </Box>
        <Box display="flex" alignItems="center" height="100%" gap={1}>
          {user ? (
            <IconButton
              size="small"
              onClick={() => router.push('/contemplation')}
              sx={{ mr: -1 }}
            >
              <AddIcon />
            </IconButton>
          ) : null}
          <DarkModeSwitch
            checked={colorMode === 'dark'}
            onChange={handleDarkModeSwitchChange}
          />
          {user ? (
            <ButtonBase
              onClick={handleAvatarClick}
              sx={{ borderRadius: '50%' }}
            >
              <Avatar
                sx={{ width: 32, height: 32 }}
                src={user?.image ?? undefined}
              >
                P
              </Avatar>
            </ButtonBase>
          ) : (
            <HeaderLink href="/login">Login</HeaderLink>
          )}
        </Box>
      </Box>

      <GlobalHeaderDrawer open={menuOpen} onClose={closeMenu} />
    </>
  );
};

export default GlobalHeader;
