import { TextField } from '@mui/material';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import { postDevLogin } from 'helpers/axios';
import useAuth from 'hooks/auth/useAuth';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';

export const getServerSideProps: GetServerSideProps = async () => {
  if (process.env.NEXT_PUBLIC_ENV !== 'development') {
    return {
      notFound: true,
    };
  }

  return {
    props: {},
  };
};

/** Only dev */
const Dev = () => {
  const router = useRouter();
  const { login } = useAuth();

  const [id, setId] = useState(process.env.NEXT_PUBLIC_DEV_USER_ID ?? '');

  const handleLogin = async () => {
    try {
      const { accessToken } = await postDevLogin(id);
      login(accessToken);
      router.replace('/');
    } catch {
      //
    }
  };

  return (
    <Container>
      <Stack py={2} alignItems="center">
        <Stack direction="row" alignItems="center" gap={1}>
          <TextField
            placeholder="_id"
            value={id}
            onChange={(event) => setId(event.target.value)}
            size="small"
          />
          <Button onClick={handleLogin} disabled={!id} variant="contained">
            로그인
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
};

export default Dev;
