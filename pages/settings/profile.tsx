import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useQueryClient } from '@tanstack/react-query';
import LoginMessage from 'components/LoginMessage';
import SettingsLayout from 'feature/setting/SettingsLayout';
import { patchUser } from 'helpers/axios';
import { LEXIO_DIVINAS_QUERY_KEY } from 'hooks/api/useLexioDivinas';
import useUser, { USER_QUERY_KEY } from 'hooks/api/useUser';
import useAuth from 'hooks/auth/useAuth';
import { enqueueSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useIntl } from 'react-intl';

type ProfileFormValues = {
  name: string;
  description: string;
  imageUrl: string;
};

const SettingsProfile = () => {
  const { formatMessage } = useIntl();
  const queryClient = useQueryClient();

  const { user } = useAuth();
  const { data: userData } = useUser(user?._id);

  const [isLoading, setIsLoading] = useState(true);
  const [imageLoadingError, setImageLoadingError] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setError,
    clearErrors,
  } = useForm<ProfileFormValues>({
    defaultValues: {
      name: '',
      description: '',
      imageUrl: '',
    },
  });

  const watchedImageUrl = watch('imageUrl');

  // Load saved data.
  useEffect(() => {
    if (userData) {
      const { user } = userData;
      reset({
        name: user.name,
        description: user.description ?? '',
        imageUrl: user.imageUrl,
      });
      setIsLoading(false);
    }
  }, [userData, reset]);

  // ImageUrl validation.
  useEffect(() => {
    if (imageLoadingError) {
      setError('imageUrl', {
        message: 'Unable to load.',
      });
    } else {
      clearErrors('imageUrl');
    }
  }, [imageLoadingError, setError, clearErrors]);

  const handleProfileSubmit: SubmitHandler<ProfileFormValues> = async ({
    name,
    description,
    imageUrl,
  }) => {
    if (!user?._id) return;

    try {
      await patchUser(user._id, { name, description, imageUrl });

      queryClient.invalidateQueries({ queryKey: [USER_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [LEXIO_DIVINAS_QUERY_KEY] });
      enqueueSnackbar(formatMessage({ id: 'success.message.saved' }), {
        variant: 'success',
      });
    } catch (error: any) {
      if (error.response.status === 409) {
        enqueueSnackbar(formatMessage({ id: 'error.message.duplicateName' }), {
          variant: 'error',
        });
      }
    }
  };

  return (
    <SettingsLayout>
      {user ? (
        <Box
          component="form"
          onSubmit={handleSubmit(handleProfileSubmit)}
          py={1.5}
        >
          <Stack spacing={1.5}>
            <Box component="label">
              <Typography
                color="text.primary"
                component="h2"
                fontWeight={500}
                variant="body1"
                mb={0.5}
              >
                이름
              </Typography>
              <Controller
                control={control}
                name="name"
                rules={{
                  required: true,
                  maxLength: 30,
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    error={!!errors.name}
                    size="small"
                    fullWidth
                    sx={{ maxWidth: 250 }}
                  />
                )}
              />
            </Box>

            <Box component="label">
              <Typography
                color="text.primary"
                component="h2"
                fontWeight={500}
                variant="body1"
                mb={0.5}
              >
                소개
              </Typography>
              <Controller
                control={control}
                name="description"
                rules={{
                  maxLength: 50,
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    error={!!errors.description}
                    size="small"
                    multiline
                    rows={4}
                    fullWidth
                  />
                )}
              />
            </Box>

            {isLoading ? (
              <Skeleton
                variant="rectangular"
                width={200}
                height={200}
                sx={{ borderRadius: '50%' }}
              />
            ) : imageLoadingError ? (
              <Box
                width={200}
                height={200}
                borderRadius="50%"
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <Typography color="text.primary">
                  이미지를 불러올 수 없어요.
                </Typography>
              </Box>
            ) : (
              <Box
                component="img"
                src={watchedImageUrl}
                alt="profile"
                width={200}
                height={200}
                borderRadius="50%"
                onError={() => setImageLoadingError(true)}
                sx={{ objectFit: 'cover' }}
              />
            )}

            <Box component="label">
              <Typography
                color="text.primary"
                component="h2"
                fontWeight={500}
                variant="body1"
                mb={0.5}
              >
                프로필 이미지 URL
              </Typography>
              <Controller
                control={control}
                name="imageUrl"
                rules={{
                  required: true,
                  maxLength: 300,
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    onChange={(event) => {
                      setImageLoadingError(false);
                      field.onChange(event);
                    }}
                    error={!!errors.imageUrl}
                    size="small"
                    fullWidth
                  />
                )}
              />
            </Box>

            <Box>
              <Button
                variant="contained"
                type="submit"
                disabled={Object.keys(errors).length > 0}
              >
                저장하기
              </Button>
            </Box>
          </Stack>
        </Box>
      ) : (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="50vh"
        >
          <LoginMessage />
        </Box>
      )}
    </SettingsLayout>
  );
};

export default SettingsProfile;
