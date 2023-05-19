import AddIcon from '@mui/icons-material/Add';
import MenuIcon from '@mui/icons-material/Menu';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import IconButton from '@mui/material/IconButton';
import DarkModeSwitch from 'components/DarkModeSwitch';
import useAuth from 'hooks/auth/useAuth';
import useColorMode from 'hooks/theme/useColorMode';
import { useRouter } from 'next/router';
import React from 'react';
import { PRIMARY_SHADOW } from 'theme/shadows';
import { addQuery, removeQuery } from 'utils/url';

import EnvChip from './EnvChip';
import GlobalHeaderDrawer from './GlobalHeaderDrawer';
import HeaderLink from './HeaderLink';

export const GLOBAL_HEADER_HEIGHT = 50;

const GlobalHeader = () => {
  const router = useRouter();

  const { user } = useAuth();
  const { colorMode, toggleColorMode } = useColorMode();

  const openMenu = () => {
    const mutatedUrl = addQuery(router.asPath, 'menu=true');
    router.push(mutatedUrl);
  };

  const closeMenu = () => {
    const mutatedUrl = removeQuery(router.asPath, 'menu');
    router.push(mutatedUrl);
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
          bgcolor: (theme) => theme.palette.paper?.main,
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
              onClick={() => router.push('/lexio-divinas/create')}
              sx={{ mr: -1 }}
            >
              <AddIcon />
            </IconButton>
          ) : null}
          <DarkModeSwitch
            checked={colorMode === 'dark'}
            onClick={toggleColorMode}
          />
          {user ? (
            <ButtonBase
              onClick={handleAvatarClick}
              sx={{ borderRadius: '50%' }}
            >
              <Avatar
                sx={{ width: 32, height: 32 }}
                src={user?.imageUrl ?? undefined}
              >
                {user.name[0]}
              </Avatar>
            </ButtonBase>
          ) : (
            <HeaderLink href="/login">Login</HeaderLink>
          )}
        </Box>

        <EnvChip />
      </Box>

      <GlobalHeaderDrawer
        open={typeof router.query?.menu === 'string'}
        onClose={closeMenu}
      />
    </>
  );
};

export default GlobalHeader;
