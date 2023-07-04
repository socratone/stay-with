import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import ErrorMessage from 'components/ErrorMessage';
import GlobalHeader from 'components/GlobalHeader';
import Meta from 'components/Meta';
import { postSignUp } from 'helpers/axios';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { enqueueSnackbar } from 'notistack';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl';
import { User } from 'schemas';

type SignUpProps = {
  kakaoId: number;
  email: string;
  imageUrl: string;
};

export const getServerSideProps: GetServerSideProps<SignUpProps> = async ({
  query,
}) => {
  const kakaoId = Number(query.kakao_id);
  const email = String(query.email);
  const imageUrl = String(query.image_url);

  if (!kakaoId || !email) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      kakaoId,
      email,
      imageUrl,
    },
  };
};

const SignUp: NextPage<SignUpProps> = ({ kakaoId, email, imageUrl }) => {
  const router = useRouter();
  const { formatMessage } = useIntl();

  const [imageChecked, setImageChecked] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Omit<User, '_id' | 'email' | 'imageUrl'>>();

  const handleSignUp: SubmitHandler<
    Omit<User, '_id' | 'email' | 'imageUrl'>
  > = async ({ name }) => {
    setIsRequesting(true);

    const trimedName = name.trim();
    if (trimedName.length === 0) {
      enqueueSnackbar(
        formatMessage({ id: '빈 문자를 이름으로 저장할 수 없습니다.' }),
        {
          variant: 'error',
        }
      );
      return;
    }

    const payload: Omit<User, '_id'> = { kakaoId, email, name: trimedName };
    if (imageChecked) {
      payload.imageUrl = imageUrl;
    }

    try {
      await postSignUp(payload);
      router.push('/login');
    } catch (error: any) {
      if (error.response.status === 409) {
        enqueueSnackbar(formatMessage({ id: 'error.message.duplicateName' }), {
          variant: 'error',
        });
      } else {
        setIsError(true);
      }
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
      <Stack
        flexGrow={1}
        spacing={1.5}
        justifyContent="center"
        alignItems="center"
      >
        {isError ? (
          <ErrorMessage />
        ) : (
          <>
            <Box>
              {imageUrl && imageChecked ? (
                <Avatar src={imageUrl} sx={{ width: 100, height: 100 }} />
              ) : (
                <Avatar sx={{ width: 100, height: 100 }}>없음</Avatar>
              )}
            </Box>

            <FormControlLabel
              control={
                <Checkbox
                  checked={imageChecked}
                  onChange={handleImageCheckedChange}
                  sx={{ ml: -1.5, my: -1.5 }}
                />
              }
              label={
                <Typography color="text.primary">
                  카카오 프로필 이미지로 설정
                </Typography>
              }
            />

            <Box>
              <Typography color="text.primary">
                <FormattedMessage id="common.name" />
              </Typography>
              <TextField
                {...register('name', {
                  required: true,
                  maxLength: 50,
                })}
                size="small"
                error={!!errors.name}
              />
            </Box>

            <Typography color="text.secondary">
              이름과 프로필 이미지는 나중에 변경할 수 있어요 😎
            </Typography>

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
      </Stack>
    </Box>
  );
};

export default SignUp;
