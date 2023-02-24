import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import GlobalHeader from 'components/GlobalHeader';
import { ObjectId } from 'mongodb';
import { GetServerSideProps, NextPage } from 'next';
import Posts from 'sections/Posts';
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
          image: user.image,
          email: user.email,
          googleId: user.googleId,
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
            // TODO: id를 받아서 요청
            // userId: user._id,
          },
        }}
      />
    </>
  );
};

export default UserId;
