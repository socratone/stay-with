import ArrowBackIcon from '@mui/icons-material/ArrowBack';
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
import { addQuery, removeQuery } from 'utils/url';

import { GLOBAL_HEADER_HEIGHT } from './constants';
import EnvChip from './EnvChip';
import GlobalHeaderDrawer from './GlobalHeaderDrawer';
import HeaderLink from './HeaderLink';

type GlobalHeaderProps = {
  dark?: true;
  backButton?: true;
};

const GlobalHeader: React.FC<GlobalHeaderProps> = ({ dark, backButton }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { user } = useAuth();
  const { colorMode, toggleColorMode } = useColorMode();

  useViewportHeight();

  const handleMenuOpen = () => {
    const mutatedUrl = addQuery(router.asPath, 'menu=true');
    router.push(mutatedUrl);
  };

  const handleMenuClose = () => {
    const mutatedUrl = removeQuery(router.asPath, 'menu');
    router.push(mutatedUrl);
  };

  const handleAvatarClick = () => {
    router.push(`/user/${user?._id}`);
  };

  const handleVideoClick = () => {
    dispatch(toggleVideoOpen());
  };

  const handleBack = () => {
    router.back();
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
          height={GLOBAL_HEADER_HEIGHT}
          px={2}
          sx={{
            borderBottom: 1,
            borderBottomColor: (theme) => theme.palette.divider,
          }}
        >
          <Box display="flex" alignItems="center" ml={-1}>
            {backButton ? (
              <IconButton
                onClick={handleBack}
                sx={{ color: dark ? '#fff' : undefined }}
              >
                <ArrowBackIcon />
              </IconButton>
            ) : (
              <IconButton
                onClick={handleMenuOpen}
                sx={{ color: dark ? '#fff' : undefined }}
              >
                <MenuIcon />
              </IconButton>
            )}
          </Box>
          <Stack direction="row" alignItems="center" height="100%">
            <IconButton size="small" onClick={handleVideoClick}>
              <MusicNoteIcon />
            </IconButton>
            {!dark ? (
              <DarkModeSwitch
                checked={colorMode === 'dark'}
                onClick={toggleColorMode}
              />
            ) : null}
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
              <HeaderLink href="/login">로그인</HeaderLink>
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
        onClose={handleMenuClose}
      />
    </>
  );
};

export default GlobalHeader;
