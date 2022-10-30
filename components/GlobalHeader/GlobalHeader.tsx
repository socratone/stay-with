import { Avatar, Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { User } from '../../libs/firebase/interfaces';
import HeaderLink from './HeaderLink';

const GlobalHeader = () => {
  const [user, setUser] = useState<User | null>(null);

  // TODO: token으로 바꿔야 함
  useEffect(() => {
    const stringifyUser = localStorage.getItem('user');
    if (stringifyUser) {
      const user = JSON.parse(stringifyUser);
      setUser(user);
    }
  }, []);

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
        <HeaderLink href="/">Home</HeaderLink>
        <HeaderLink href="/form">Form</HeaderLink>
        <HeaderLink href="/login">Sign in</HeaderLink>
        <HeaderLink href="/signup">Sign up</HeaderLink>
      </Box>
      <Box display="flex" alignItems="center">
        {user ? (
          <Avatar sx={{ width: 32, height: 32 }}>{user.nickname[0]}</Avatar>
        ) : null}
      </Box>
    </Box>
  );
};

export default GlobalHeader;
