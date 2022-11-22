import {
  Avatar,
  Box,
  ButtonBase,
  IconButton,
  MenuItem,
  useTheme,
} from '@mui/material';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import useAuthenticated from '../../hooks/context/useAuthenticated';
import useColorMode from '../../hooks/context/useColorMode';
import { PRIMARY_SHADOW } from '../../theme/shadows';
import DarkModeSwitch from '../DarkModeSwitch';
import SmallMenu from '../SmallMenu';
import HeaderLink from './HeaderLink';
import MenuIcon from '@mui/icons-material/Menu';

const GlobalHeader = () => {
  const router = useRouter();
  const theme = useTheme();

  const { status, user } = useAuthenticated();
  const { colorMode, setColorMode } = useColorMode();

  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(menuAnchorEl);

  const [profileMenuAnchorEl, setProfileMenuAnchorEl] =
    useState<null | HTMLElement>(null);
  const profileMenuOpen = Boolean(profileMenuAnchorEl);

  const openMenu = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const closeMenu = () => {
    setMenuAnchorEl(null);
  };

  const openProfileMenu = (event: React.MouseEvent<HTMLElement>) => {
    setProfileMenuAnchorEl(event.currentTarget);
  };

  const closeProfileMenu = () => {
    setProfileMenuAnchorEl(null);
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
      <Box display="flex" alignItems="center" ml={-1}>
        <IconButton onClick={openMenu}>
          <MenuIcon />
        </IconButton>
        <SmallMenu anchorEl={menuAnchorEl} open={menuOpen} onClose={closeMenu}>
          <MenuItem onClick={() => router.push('/')}>나눔</MenuItem>
          <MenuItem onClick={() => router.push('/contemplation')}>
            묵상
          </MenuItem>
        </SmallMenu>
      </Box>
      <Box display="flex" alignItems="center" height="100%" gap={1}>
        <DarkModeSwitch
          checked={colorMode === 'dark'}
          onChange={handleDarkModeSwitchChange}
        />
        {status === 'authenticated' ? (
          <>
            <ButtonBase onClick={openProfileMenu} sx={{ borderRadius: '50%' }}>
              <Avatar
                sx={{ width: 32, height: 32 }}
                src={user?.image ?? undefined}
              >
                P
              </Avatar>
            </ButtonBase>
            <SmallMenu
              anchorEl={profileMenuAnchorEl}
              open={profileMenuOpen}
              onClose={closeProfileMenu}
            >
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
