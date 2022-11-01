import { Avatar, Box, ButtonBase, MenuItem, useTheme } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { User } from '../../libs/firebase/interfaces';
import { PRIMARY_BOX_SHADOW } from '../../theme/boxShadow';
import SmallMenu from '../SmallMenu';
import HeaderLink from './HeaderLink';

const GlobalHeader = () => {
  const theme = useTheme();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const [user, setUser] = useState<User | null>(null);

  // TODO: token으로 바꿔야 함
  useEffect(() => {
    const stringifyUser = localStorage.getItem('user');
    if (stringifyUser) {
      const user = JSON.parse(stringifyUser);
      setUser(user);
    }
  }, []);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = () => {
    localStorage.removeItem('user');
    setAnchorEl(null);
    router.reload();
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
        {user ? (
          <>
            <ButtonBase onClick={handleClick} sx={{ borderRadius: '50%' }}>
              <Avatar sx={{ width: 32, height: 32 }}>{user.nickname[0]}</Avatar>
            </ButtonBase>
            <SmallMenu anchorEl={anchorEl} open={open} onClose={handleClose}>
              <MenuItem onClick={() => router.push('/form')}>
                나눔 글쓰기
              </MenuItem>
              <MenuItem onClick={handleSignOut}>로그아웃</MenuItem>
            </SmallMenu>
          </>
        ) : (
          <>
            <HeaderLink href="/login">로그인</HeaderLink>
            <HeaderLink href="/signup">회원가입</HeaderLink>
          </>
        )}
      </Box>
    </Box>
  );
};

export default GlobalHeader;
