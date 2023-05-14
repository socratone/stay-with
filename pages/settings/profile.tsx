import styled from '@emotion/styled';
import AccessibilityIcon from '@mui/icons-material/Accessibility';
import { Stack } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useQueryClient } from '@tanstack/react-query';
import GlobalHeader from 'components/GlobalHeader/GlobalHeader';
import Meta from 'components/Meta/Meta';
import { UserFormValues } from 'components/UserForm/UserForm';
import { patchUser } from 'helpers/axios';
import { LEXIO_DIVINAS_QUERY_KEY } from 'hooks/api/useLexioDivinas';
import useUser, { USER_QUERY_KEY } from 'hooks/api/useUser';
import useAuth from 'hooks/auth/useAuth';
import Link from 'next/link';
import { enqueueSnackbar } from 'notistack';
import { useEffect } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useIntl } from 'react-intl';

const StyledLink = styled(Link)`
  display: block;
  width: 100%;
`;

const SettingsProfile = () => {
  const { formatMessage } = useIntl();
  const queryClient = useQueryClient();

  const { user } = useAuth();
  const { data: userData } = useUser(user?._id);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<UserFormValues>();

  useEffect(() => {
    if (userData) {
      const { user } = userData;
      setValue('name', user.name);
    }
  }, [userData, setValue]);

  const handleProfileSubmit: SubmitHandler<UserFormValues> = async ({
    name,
  }) => {
    if (!user?._id) return;

    try {
      await patchUser(user._id, { name });
      queryClient.invalidateQueries({ queryKey: [USER_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [LEXIO_DIVINAS_QUERY_KEY] });
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
                    <ListItemText primary="프로필" />
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
            <Stack spacing={1}>
              <Typography
                color="text.primary"
                component="h2"
                fontWeight={500}
                variant="body1"
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
                  <TextField {...field} error={!!errors.name} size="small" />
                )}
              />
              <Box>
                <Button variant="contained" type="submit">
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
