import {
  Avatar,
  Box,
  ButtonBase,
  IconButton,
  MenuItem,
  useTheme,
} from '@mui/material';
import { useRouter } from 'next/router';
import { useState } from 'react';
import useAuth from '../../hooks/context/useAuth';
import useColorMode from '../../hooks/context/useColorMode';
import { PRIMARY_SHADOW } from '../../theme/shadows';
import DarkModeSwitch from '../DarkModeSwitch';
import SmallMenu from '../SmallMenu';
import HeaderLink from './HeaderLink';
import MenuIcon from '@mui/icons-material/Menu';
import AddIcon from '@mui/icons-material/Add';
import GlobalHeaderDrawer from './GlobalHeaderDrawer';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';

const GlobalHeader = () => {
  const router = useRouter();
  const theme = useTheme();

  const { user, logout } = useAuth();
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

  const handleDarkModeSwitchChange = (checked: boolean) => {
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
            sx={{ mr: -1 }}
          />
          <IconButton size="small">
            <Box width={24} height={24}>
              <NotificationsNoneIcon
                sx={{ width: 20, height: 20, mt: '2px' }}
              />
            </Box>
          </IconButton>
          {user ? (
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
                <MenuItem onClick={() => router.push(`/user/${user?.id}`)}>
                  내 페이지
                </MenuItem>
                <MenuItem onClick={() => router.push('/setting')}>
                  설정
                </MenuItem>
                <MenuItem onClick={logout}>로그아웃</MenuItem>
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
