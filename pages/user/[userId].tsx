import { Avatar, Box, Typography } from '@mui/material';
import { GetServerSideProps, NextPage } from 'next';
import GlobalHeader from '../../components/GlobalHeader';
import { getUser } from '../../libs/firebase/apis';
import { User } from '../../libs/firebase/interfaces';
import Posts from '../../sections/Posts';

interface UserIdProps {
  user: User;
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
    const user = await getUser(query.userId);

    if (!user) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        user: {
          ...user,
          id: query.userId,
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
  return (
    <>
      <GlobalHeader />

      <Box pt={2} px={2}>
        <Box display="flex" gap={1} alignItems="center">
          {user?.image ? (
            <Avatar alt="Profile" src={user.image} />
          ) : (
            <Avatar sx={{ width: 34, height: 34 }}>
              {user.name?.[0] ?? 'P'}
            </Avatar>
          )}
          <Typography color="text.primary" fontWeight={500}>
            {user.name}
          </Typography>
        </Box>
      </Box>

      <Posts
        fetchOptions={{
          filter: {
            userId: user.id,
          },
        }}
      />
    </>
  );
};

export default UserId;
