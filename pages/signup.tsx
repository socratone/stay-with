import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import ErrorMessage from 'components/ErrorMessage';
import GlobalHeader from 'components/GlobalHeader';
import Meta from 'components/Meta';
import useAuth from 'hooks/context/useAuth';
import { postLogin, postSignUp } from 'libs/axios/apis';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { User } from 'types/interfaces';

interface SignUpProps {
  googleAccessToken: string;
  googleId: string;
  email: string;
  image: string;
}

export const getServerSideProps: GetServerSideProps<SignUpProps> = async ({
  query,
}) => {
  const googleAccessToken = String(query.google_access_token);
  const googleId = String(query.google_id);
  const email = String(query.email);
  const image = String(query.picture);

  if (!googleId || !email) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      googleAccessToken,
      googleId,
      email,
      image,
    },
  };
};

const SignUp: NextPage<SignUpProps> = ({
  googleAccessToken,
  googleId,
  email,
  image,
}) => {
  const router = useRouter();
  const { login } = useAuth();

  const [imageChecked, setImageChecked] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Omit<User, '_id' | 'email' | 'image'>>();

  const handleSignUp: SubmitHandler<
    Omit<User, '_id' | 'email' | 'image'>
  > = async ({ name }) => {
    setIsRequesting(true);

    const payload: Omit<User, '_id'> = { googleId, email, name };
    if (imageChecked) {
      payload.image = image;
    }

    try {
      await postSignUp(payload);

      const { accessToken } = await postLogin(googleAccessToken);

      login(accessToken);

      router.push('/');
    } catch {
      setIsError(true);
    }
  };

  const handleImageCheckedChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    setImageChecked(checked);
  };

  return (
    <Box height="100vh" display="flex" flexDirection="column">
      <Meta />
      <GlobalHeader />
      <Box
        flexGrow={1}
        gap={1}
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        {isError ? (
          <ErrorMessage />
        ) : (
          <>
            <Box>
              {image && imageChecked ? (
                <Avatar src={image} sx={{ width: 100, height: 100 }} />
              ) : (
                <Avatar sx={{ width: 100, height: 100 }}>없음</Avatar>
              )}
            </Box>
            <Box>
              <Typography color="text.primary">이름</Typography>
              <TextField
                {...register('name', {
                  required: true,
                  maxLength: 50,
                })}
                size="small"
                error={!!errors.name}
              />
            </Box>

            <FormControlLabel
              control={
                <Checkbox
                  checked={imageChecked}
                  onChange={handleImageCheckedChange}
                />
              }
              label={
                <Typography color="text.primary">프로필 이미지 공개</Typography>
              }
            />

            <Box>
              <Button
                variant="contained"
                onClick={handleSubmit(handleSignUp)}
                disabled={isRequesting}
              >
                가입하기
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

export default SignUp;
