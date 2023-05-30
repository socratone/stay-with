import AddIcon from '@mui/icons-material/Add';
import MenuIcon from '@mui/icons-material/Menu';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import IconButton from '@mui/material/IconButton';
import DarkModeSwitch from 'components/DarkModeSwitch';
import useAuth from 'hooks/auth/useAuth';
import useViewportHeight from 'hooks/dom/useViewportHeight';
import useColorMode from 'hooks/theme/useColorMode';
import { useRouter } from 'next/router';
import React from 'react';
import { PRIMARY_SHADOW } from 'theme/shadows';
import { addQuery, removeQuery } from 'utils/url';

import { GLOBAL_HEADER_HEIGHT } from './constants';
import EnvChip from './EnvChip';
import GlobalHeaderDrawer from './GlobalHeaderDrawer';
import HeaderLink from './HeaderLink';

type GlobalHeaderProps = {
  dark?: true;
};

const GlobalHeader: React.FC<GlobalHeaderProps> = ({ dark }) => {
  const router = useRouter();

  const { user } = useAuth();
  const { colorMode, toggleColorMode } = useColorMode();

  useViewportHeight();

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
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          bgcolor: (theme) =>
            dark ? '#000' : theme.palette.background.default,
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          boxShadow={PRIMARY_SHADOW}
          height={GLOBAL_HEADER_HEIGHT}
          px={2}
        >
          <Box display="flex" alignItems="center" ml={-1}>
            <IconButton
              onClick={openMenu}
              sx={{ color: dark ? '#fff' : undefined }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
          <Box display="flex" alignItems="center" height="100%" gap={1}>
            {user ? (
              <IconButton
                size="small"
                onClick={() => router.push('/lexio-divinas/create')}
                sx={{ mr: -1, color: dark ? '#fff' : undefined }}
              >
                <AddIcon />
              </IconButton>
            ) : null}
            <DarkModeSwitch
              checked={dark ? dark : colorMode === 'dark'}
              disabled={dark}
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
      </Box>

      <GlobalHeaderDrawer
        open={typeof router.query?.menu === 'string'}
        onClose={closeMenu}
      />
    </>
  );
};

export default GlobalHeader;
