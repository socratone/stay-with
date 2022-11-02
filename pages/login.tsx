import { Box, Button, TextField } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import GlobalHeader from '../components/GlobalHeader';
import { getUserByEmail } from '../libs/firebase/apis';

interface IFormInput {
  email: string;
  password: string;
}

const Login = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();

  const [isRequested, setIsRequested] = useState(false);

  const onSubmit: SubmitHandler<IFormInput> = async ({ email, password }) => {
    setIsRequested(true);
    try {
      const user = await getUserByEmail(email);
      localStorage.setItem('user', JSON.stringify(user));
      router.push('/');
    } catch (error) {
      console.error(error);
    } finally {
      setIsRequested(false);
    }
  };

  return (
    <Box height="100vh" display="flex" flexDirection="column">
      <GlobalHeader />
      <Box
        flexGrow={1}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Box
          component="form"
          display="flex"
          flexDirection="column"
          gap={2}
          onSubmit={handleSubmit(onSubmit)}
        >
          <TextField
            {...register('email', {
              required: true,
            })}
            placeholder="이메일"
            fullWidth
            size="small"
            error={!!errors.email}
          />
          <TextField
            {...register('password', {
              required: true,
            })}
            placeholder="비밀번호"
            fullWidth
            size="small"
            error={!!errors.password}
          />
          <Button type="submit" variant="contained" disabled={isRequested}>
            로그인
          </Button>
          <Link href="/signup">
            <Button>회원가입</Button>
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
