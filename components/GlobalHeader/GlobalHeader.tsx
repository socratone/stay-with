import { Avatar, Box, ButtonBase, Menu, MenuItem } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { User } from '../../libs/firebase/interfaces';
import HeaderLink from './HeaderLink';

const GlobalHeader = () => {
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
      borderBottom={1}
      borderColor="gainsboro"
      height={50}
      px={2}
    >
      <Box display="flex" height="100%" gap={1}>
        <HeaderLink href="/">홈</HeaderLink>
        <HeaderLink href="/form">글쓰기</HeaderLink>
      </Box>
      <Box display="flex" alignItems="center" height="100%" gap={1}>
        {user ? (
          <>
            <ButtonBase onClick={handleClick} sx={{ borderRadius: '50%' }}>
              <Avatar sx={{ width: 32, height: 32 }}>{user.nickname[0]}</Avatar>
            </ButtonBase>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem onClick={handleSignOut}>로그아웃</MenuItem>
            </Menu>
          </>
        ) : (
          <>
            <HeaderLink href="/login">로그인</HeaderLink>
            <HeaderLink href="/signup">회원 가입</HeaderLink>
          </>
        )}
      </Box>
    </Box>
  );
};

export default GlobalHeader;
