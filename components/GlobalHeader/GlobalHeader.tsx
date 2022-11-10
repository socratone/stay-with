import { Avatar, Box, ButtonBase, MenuItem, useTheme } from '@mui/material';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { PRIMARY_BOX_SHADOW } from '../../theme/boxShadow';
import SmallMenu from '../SmallMenu';
import HeaderLink from './HeaderLink';

const GlobalHeader = () => {
  const theme = useTheme();
  const router = useRouter();
  const { data: session } = useSession();

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

  return (
    <Box
      component="header"
      display="flex"
      justifyContent="space-between"
      boxShadow={PRIMARY_BOX_SHADOW}
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
        <HeaderLink href="/">MMM</HeaderLink>
      </Box>
      <Box display="flex" alignItems="center" height="100%" gap={1}>
        {session ? (
          <>
            <ButtonBase onClick={handleClick} sx={{ borderRadius: '50%' }}>
              <Avatar
                sx={{ width: 32, height: 32 }}
                src={session.user?.image ?? undefined}
              >
                P
              </Avatar>
            </ButtonBase>
            <SmallMenu anchorEl={anchorEl} open={open} onClose={handleClose}>
              <MenuItem onClick={() => router.push('/form')}>
                나눔 글쓰기
              </MenuItem>
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
