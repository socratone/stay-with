import { Box, Button, TextField } from '@mui/material';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import GlobalHeader from '../components/GlobalHeader';
import { addUser } from '../libs/firebase/apis';

interface IFormInput {
  nickname: string;
  email: string;
  password: string;
}

const SignUp = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();

  const [isRequested, setIsRequested] = useState(false);

  const onSubmit: SubmitHandler<IFormInput> = async ({
    nickname,
    email,
    password,
  }) => {
    setIsRequested(true);
    try {
      await addUser({
        nickname,
        email,
        password,
      });

      router.push('/login');
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
            {...register('nickname', {
              required: true,
            })}
            placeholder="닉네임"
            fullWidth
            size="small"
            error={!!errors.nickname}
          />
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
            회원 가입
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default SignUp;
