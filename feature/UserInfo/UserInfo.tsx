import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import useUser from 'hooks/api/useUser';
import useAuth from 'hooks/auth/useAuth';

type UserInfoProps = {
  userId?: string;
};

const UserInfo: React.FC<UserInfoProps> = ({ userId }) => {
  const { data: userData } = useUser(userId);
  const { user: me, logout } = useAuth();
  const isMyself = me?._id === userId;

  return (
    <Box pt={2} px={2}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack direction="row" gap={1} alignItems="center">
          <Avatar
            alt="profile"
            src={userData?.user.imageUrl}
            sx={{ width: 34, height: 34 }}
          >
            {userData?.user.name?.[0] ?? 'P'}
          </Avatar>
          <Typography color="text.primary" fontWeight={500}>
            {userData?.user.name}
          </Typography>
        </Stack>
        {isMyself ? <Button onClick={logout}>로그아웃</Button> : null}
      </Stack>
    </Box>
  );
};

export default UserInfo;
