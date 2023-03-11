import EditIcon from '@mui/icons-material/Edit';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import UserForm, { UserFormValues } from 'components/UserForm/UserForm';
import { LEXIO_DIVINAS_KEY } from 'feature/LexioDivinas/LexioDivinas';
import { patchUser } from 'helpers/axios';
import useUser from 'hooks/api/useUser';
import useAuth from 'hooks/context/useAuth';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useQueryClient } from 'react-query';

interface UserInfoProps {
  userId?: string;
}

const UserInfo: React.FC<UserInfoProps> = ({ userId }) => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const { data: userData } = useUser(userId);
  const { user: me, logout } = useAuth();
  const isMyself = me?._id === userId;

  const [isEdit, setIsEdit] = useState(false);
  const [isRequested, setIsRequested] = useState(false);

  const form = useForm<UserFormValues>();
  const setValue = form.setValue;

  useEffect(() => {
    if (userData) {
      const { user } = userData;
      setValue('name', user.name);
    }
  }, [userData, setValue]);

  const handleNameEditButtonClick = () => {
    setIsEdit(true);
  };

  const handleSubmit: SubmitHandler<UserFormValues> = async ({ name }) => {
    if (!userId) return;

    setIsRequested(true);

    try {
      await patchUser(userId, { name });
      setIsEdit(false);
      queryClient.invalidateQueries({ queryKey: '/api/users' });
      queryClient.invalidateQueries(LEXIO_DIVINAS_KEY);
    } catch {
      enqueueSnackbar('에러가 발생했습니다.');
    } finally {
      setIsRequested(false);
    }
  };

  const handleCancel = () => {
    setIsEdit(false);
  };

  return (
    <Box pt={2} px={2}>
      {isEdit ? (
        <UserForm
          form={form}
          isRequested={isRequested}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      ) : (
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Stack direction="row" gap={1} alignItems="center">
            {userData?.user.imageUrl ? (
              <Avatar alt="Profile" src={userData?.user.imageUrl} />
            ) : (
              <Avatar sx={{ width: 34, height: 34 }}>
                {userData?.user.name?.[0] ?? 'P'}
              </Avatar>
            )}
            <Typography color="text.primary" fontWeight={500}>
              {userData?.user.name}
            </Typography>
            <IconButton onClick={handleNameEditButtonClick} size="small">
              <EditIcon fontSize="small" />
            </IconButton>
          </Stack>
          {isMyself ? <Button onClick={logout}>로그아웃</Button> : null}
        </Stack>
      )}
    </Box>
  );
};

export default UserInfo;
