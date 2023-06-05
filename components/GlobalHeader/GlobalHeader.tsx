import AddIcon from '@mui/icons-material/Add';
import MenuIcon from '@mui/icons-material/Menu';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import DarkModeSwitch from 'components/DarkModeSwitch';
import ProfileAvatar from 'components/ProfileAvatar/ProfileAvatar';
import useAuth from 'hooks/auth/useAuth';
import useViewportHeight from 'hooks/dom/useViewportHeight';
import useColorMode from 'hooks/theme/useColorMode';
import { useRouter } from 'next/router';
import React from 'react';
import { useAppDispatch } from 'redux/hooks';
import { toggleVideoOpen } from 'redux/videoSlice';
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
  const dispatch = useAppDispatch();

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

  const handleAvatarClick = () => {
    router.push(`/user/${user?._id}`);
  };

  const handleVideoClick = () => {
    dispatch(toggleVideoOpen());
  };

  return (
    <>
      <Box
        component="header"
        sx={{
          position: 'fixed',
          width: '100%',
          top: 0,
          left: 0,
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
          <Stack direction="row" alignItems="center" height="100%">
            {user ? (
              <IconButton
                size="small"
                onClick={() => router.push('/lexio-divinas/create')}
                sx={{ color: dark ? '#fff' : undefined }}
              >
                <AddIcon />
              </IconButton>
            ) : null}
            <IconButton size="small" onClick={handleVideoClick}>
              <MusicNoteIcon />
            </IconButton>
            <DarkModeSwitch
              checked={dark ? dark : colorMode === 'dark'}
              disabled={dark}
              onClick={toggleColorMode}
            />
            {user ? (
              <ButtonBase
                onClick={handleAvatarClick}
                sx={{ borderRadius: '50%', ml: 1 }}
              >
                <ProfileAvatar
                  src={user?.imageUrl ?? undefined}
                  size="2.125rem"
                />
              </ButtonBase>
            ) : (
              <HeaderLink href="/login">Login</HeaderLink>
            )}
          </Stack>

          <EnvChip />
        </Box>
      </Box>

      {/* bumper */}
      <Box
        height={GLOBAL_HEADER_HEIGHT}
        sx={{
          bgcolor: (theme) =>
            dark ? '#000' : theme.palette.background.default,
        }}
      />

      <GlobalHeaderDrawer
        open={typeof router.query?.menu === 'string'}
        onClose={closeMenu}
      />
    </>
  );
};

export default GlobalHeader;
