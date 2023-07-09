import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import GlobalHeader from 'components/GlobalHeader';
import LoadingCircular from 'components/LoadingCircular/LoadingCircular';
import Meta from 'components/Meta';
import NotificationItem from 'components/NotificationItem/NotificationItem';
import useNotifications from 'hooks/api/useNotifications';
import useAuth from 'hooks/auth/useAuth';
import { FormattedMessage } from 'react-intl';

const Notifications = () => {
  const { user } = useAuth();

  const {
    data: notificationsData,
    isLoading,
    isError,
  } = useNotifications({
    userId: user?._id,
  });

  const isEmpty = !isLoading && notificationsData?.notifications.length === 0;

  return (
    <>
      <Meta />
      <GlobalHeader backButton />
      <Container>
        <Stack gap={1} py={2}>
          {isLoading ? (
            <LoadingCircular />
          ) : isError ? (
            <Box display="flex" justifyContent="center">
              <Typography color="text.primary">
                <FormattedMessage id="error.message.common" />
              </Typography>
            </Box>
          ) : isEmpty ? (
            <Box display="flex" justifyContent="center">
              <Typography color="text.primary">알림이 없어요 🔔</Typography>
            </Box>
          ) : (
            notificationsData?.notifications.map((notification) => (
              <NotificationItem
                key={notification._id}
                id={notification._id}
                type={notification.type}
                user={notification.notifier}
                message={notification.message}
                isNew={notification.isNew}
                lexioDivinaId={notification.lexioDivinaId}
              />
            ))
          )}
        </Stack>
      </Container>
    </>
  );
};

export default Notifications;
