import { Avatar, Box, ButtonBase, MenuItem, useTheme } from '@mui/material';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import useAuthenticated from '../../hooks/context/useAuthenticated';
import useColorMode from '../../hooks/context/useColorMode';
import { PRIMARY_SHADOW } from '../../theme/shadows';
import DarkModeSwitch from '../DarkModeSwitch';
import SmallMenu from '../SmallMenu';
import HeaderLink from './HeaderLink';

const GlobalHeader = () => {
  const router = useRouter();
  const theme = useTheme();

  const { status, user } = useAuthenticated();
  const { colorMode, setColorMode } = useColorMode();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = () => {
    signOut({
      callbackUrl: '/',
    });
  };

  const handleDarkModeSwitchChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    setColorMode(checked ? 'dark' : 'light');
  };

  return (
    <Box
      component="header"
      display="flex"
      justifyContent="space-between"
      boxShadow={PRIMARY_SHADOW}
      height={50}
      px={2}
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        bgcolor: theme.palette.paper?.main,
      }}
    >
      <Box display="flex" height="100%" gap={1}>
        <HeaderLink href="/">나눔</HeaderLink>
        <HeaderLink href="/contemplation">묵상</HeaderLink>
      </Box>
      <Box display="flex" alignItems="center" height="100%" gap={1}>
        <DarkModeSwitch
          checked={colorMode === 'dark'}
          onChange={handleDarkModeSwitchChange}
        />
        {status === 'authenticated' ? (
          <>
            <ButtonBase onClick={handleClick} sx={{ borderRadius: '50%' }}>
              <Avatar
                sx={{ width: 32, height: 32 }}
                src={user?.image ?? undefined}
              >
                P
              </Avatar>
            </ButtonBase>
            <SmallMenu anchorEl={anchorEl} open={open} onClose={handleClose}>
              <MenuItem onClick={() => router.push('/setting')}>설정</MenuItem>
              <MenuItem onClick={handleSignOut}>로그아웃</MenuItem>
            </SmallMenu>
          </>
        ) : (
          <HeaderLink href="/login">Login</HeaderLink>
        )}
      </Box>
    </Box>
  );
};

export default GlobalHeader;
