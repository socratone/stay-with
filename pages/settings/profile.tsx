import styled from '@emotion/styled';
import AccessibilityIcon from '@mui/icons-material/Accessibility';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useQueryClient } from '@tanstack/react-query';
import GlobalHeader from 'components/GlobalHeader/GlobalHeader';
import Meta from 'components/Meta/Meta';
import { patchUser } from 'helpers/axios';
import { LEXIO_DIVINAS_QUERY_KEY } from 'hooks/api/useLexioDivinas';
import useUser, { USER_QUERY_KEY } from 'hooks/api/useUser';
import useAuth from 'hooks/auth/useAuth';
import Link from 'next/link';
import { enqueueSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useIntl } from 'react-intl';

type UserFormValues = {
  name: string;
  description: string;
  imageUrl: string;
};

const StyledLink = styled(Link)`
  display: block;
  width: 100%;
`;

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
  } = useForm<UserFormValues>({
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

  const handleProfileSubmit: SubmitHandler<UserFormValues> = async ({
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
      } else {
        enqueueSnackbar(formatMessage({ id: 'error.message.common' }), {
          variant: 'error',
        });
      }
    }
  };

  return (
    <>
      <Meta />
      <GlobalHeader />
      <Container>
        <Box
          display="grid"
          gridTemplateColumns={{ xs: '1fr', md: '250px 1fr', lg: '250px 1fr' }}
          gap={{ xs: 0, md: 2, lg: 2 }}
        >
          <Box>
            <List sx={{ py: 0 }}>
              <ListItem disablePadding>
                <StyledLink href="/settings/profile">
                  <ListItemButton sx={{ px: { xs: 0, md: 2, lg: 2 } }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <AccessibilityIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography
                          color={(theme) => theme.palette.text.primary}
                        >
                          프로필
                        </Typography>
                      }
                    />
                  </ListItemButton>
                </StyledLink>
              </ListItem>
            </List>
          </Box>
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
                      disabled={!user}
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
                      disabled={!user}
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
                      disabled={!user}
                    />
                  )}
                />
              </Box>

              <Box>
                <Button
                  variant="contained"
                  type="submit"
                  disabled={!user || Object.keys(errors).length > 0}
                >
                  저장하기
                </Button>
              </Box>
            </Stack>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default SettingsProfile;
