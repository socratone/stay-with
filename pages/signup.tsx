import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
} from '@mui/material';
import GlobalHeader from '../components/GlobalHeader';
import { GetServerSideProps, NextPage } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]';
import { addUser, getUserByEmail } from '../libs/firebase/apis';
import { User } from '../libs/firebase/interfaces';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/userSlice';

interface SignUpProps {
  user?: User;
  notSubscribedUser?: Omit<User, 'id'>;
}

export const getServerSideProps: GetServerSideProps<SignUpProps> = async ({
  req,
  res,
}) => {
  const session = await unstable_getServerSession(req, res, authOptions);

  // 로그인하지 않은 경우
  if (!session?.user?.email || !session?.user?.name) {
    return { notFound: true };
  }

  const user = await getUserByEmail(session.user.email);

  // 아이디를 이미 생성한 경우
  if (user) {
    return {
      props: {
        user,
      },
    };
  }

  return {
    props: {
      notSubscribedUser: {
        email: session.user.email,
        name: session.user.name,
        image: session.user.image ?? undefined,
      },
    },
  };
};

const SignUp: NextPage<SignUpProps> = ({ user, notSubscribedUser }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [imageChecked, setImageChecked] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Omit<User, 'id' | 'image'>>({
    defaultValues: user,
  });

  useEffect(() => {
    if (user) {
      setTimeout(() => {
        router.push('/');
      }, 1000);

      // client에서 로그인
      dispatch(
        setUser({
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image ?? '',
        })
      );
    }
  }, [router, dispatch, user]);

  const handleSignUp: SubmitHandler<Omit<User, 'id' | 'image'>> = async ({
    email,
    name,
  }) => {
    const payload: Omit<User, 'id'> = { email, name };
    if (imageChecked && notSubscribedUser?.image) {
      payload.image = notSubscribedUser?.image;
    }

    try {
      const addedUser = await addUser(payload);
      // client에서 로그인
      dispatch(
        setUser({
          id: addedUser.id,
          email: addedUser.email,
          name: addedUser.name,
          image: addedUser.image ?? '',
        })
      );
      router.push('/');
    } catch (error) {
      console.error(error);
    }
  };

  const handleImageCheckedChange = (_: any, checked: boolean) => {
    setImageChecked(checked);
  };

  if (user) {
    return (
      <Box
        height="100%"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <Typography>{user.name}님 환영합니다!</Typography>
      </Box>
    );
  }

  if (notSubscribedUser) {
    return (
      <Box height="100vh" display="flex" flexDirection="column">
        <GlobalHeader />
        <Box
          flexGrow={1}
          gap={1}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          <Typography>{notSubscribedUser.name}님 환영합니다!</Typography>
          <Box>
            <TextField
              {...register('name', {
                required: true,
              })}
              size="small"
              error={!!errors.name}
            />
          </Box>

          <Box>
            <TextField
              {...register('email', {
                required: true,
              })}
              size="small"
              error={!!errors.email}
            />
          </Box>

          <FormControlLabel
            control={
              <Checkbox
                checked={imageChecked}
                onChange={handleImageCheckedChange}
              />
            }
            label="프로필 이미지 공개"
          />

          <Box>
            <Button variant="contained" onClick={handleSubmit(handleSignUp)}>
              가입하기
            </Button>
          </Box>
        </Box>
      </Box>
    );
  }

  return null;
};

export default SignUp;
