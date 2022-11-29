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
import AddIcon from '@mui/icons-material/Add';
import GlobalHeaderDrawer from './GlobalHeaderDrawer';

const GlobalHeader = () => {
  const router = useRouter();
  const theme = useTheme();

  const { status, user } = useAuthenticated();
  const { colorMode, setColorMode } = useColorMode();

  const [profileMenuAnchorEl, setProfileMenuAnchorEl] =
    useState<null | HTMLElement>(null);
  const profileMenuOpen = Boolean(profileMenuAnchorEl);

  const [menuOpen, setMenuOpen] = useState(false);

  const openMenu = () => setMenuOpen(true);

  const closeMenu = () => setMenuOpen(false);

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
    <>
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
        </Box>
        <Box display="flex" alignItems="center" height="100%" gap={1}>
          <IconButton
            onClick={() => router.push('/contemplation')}
            sx={{ mr: -1 }}
          >
            <AddIcon />
          </IconButton>
          <DarkModeSwitch
            checked={colorMode === 'dark'}
            onChange={handleDarkModeSwitchChange}
          />
          {status === 'authenticated' ? (
            <>
              <ButtonBase
                onClick={openProfileMenu}
                sx={{ borderRadius: '50%' }}
              >
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
                <MenuItem onClick={() => router.push('/setting')}>
                  설정
                </MenuItem>
                <MenuItem onClick={handleSignOut}>로그아웃</MenuItem>
              </SmallMenu>
            </>
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
