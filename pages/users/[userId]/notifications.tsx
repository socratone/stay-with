import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import GlobalHeader from 'components/GlobalHeader';
import Meta from 'components/Meta';
import NotificationItem from 'components/NotificationItem/NotificationItem';
import useNotifications from 'hooks/api/useNotifications';
import useAuth from 'hooks/auth/useAuth';

const Notifications = () => {
  const { user } = useAuth();

  const { data: notificationsData } = useNotifications({
    userId: user?._id,
  });

  return (
    <>
      <Meta />
      <GlobalHeader backButton />
      <Container>
        <Stack gap={1}>
          {notificationsData?.notifications.map((notification) => (
            <NotificationItem
              key={notification._id}
              type={notification.type}
              user={notification.notifier}
              message={notification.message}
              newed={notification.isNew}
            />
          ))}
        </Stack>
      </Container>
    </>
  );
};

export default Notifications;
