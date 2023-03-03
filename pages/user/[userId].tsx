import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import GlobalHeader from 'components/GlobalHeader';
import Meta from 'components/Meta';
import useAuth from 'hooks/context/useAuth';
import { ObjectId } from 'mongodb';
import { GetServerSideProps, NextPage } from 'next';
import LexioDivinas from 'sections/LexioDivinas';
import Database, { CollectionName } from 'server/database';
import { User } from 'types/interfaces';

interface UserIdProps {
  user: Omit<User, '_id'>;
}

export const getServerSideProps: GetServerSideProps<UserIdProps> = async ({
  query,
}) => {
  if (typeof query.userId !== 'string') {
    return {
      notFound: true,
    };
  }

  try {
    const db = new Database();
    const user = await db.findOne<User>(CollectionName.Users, {
      _id: new ObjectId(query.userId),
    });

    if (!user) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        user: {
          imageUrl: user.imageUrl,
          email: user.email,
          kakaoId: user.kakaoId,
          name: user.name,
        },
      },
    };
  } catch (error) {
    console.error(error);
    return {
      notFound: true,
    };
  }
};

const UserId: NextPage<UserIdProps> = ({ user }) => {
  const { user: me, logout } = useAuth();
  const isLoggedIn = !!me;

  return (
    <>
      <Meta />
      <GlobalHeader />

      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        pt={2}
        px={2}
      >
        <Box display="flex" gap={1} alignItems="center">
          {user?.imageUrl ? (
            <Avatar alt="Profile" src={user.imageUrl} />
          ) : (
            <Avatar sx={{ width: 34, height: 34 }}>
              {user.name?.[0] ?? 'P'}
            </Avatar>
          )}
          <Typography color="text.primary" fontWeight={500}>
            {user.name}
          </Typography>
        </Box>
        {isLoggedIn ? (
          <Button color="inherit" onClick={logout}>
            로그아웃
          </Button>
        ) : null}
      </Stack>

      <LexioDivinas
        fetchOptions={{
          filter: {
            // TODO: id를 받아서 요청
            // userId: user._id,
          },
        }}
      />
    </>
  );
};

export default UserId;
