import Container from '@mui/material/Container';
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
        {notificationsData?.notifications.map((notification) => (
          <NotificationItem
            key={notification._id}
            type={notification.type}
            users={notification.notifiers}
            message={notification.message}
            newed={notification.newed}
          />
        ))}
      </Container>
    </>
  );
};

export default Notifications;
