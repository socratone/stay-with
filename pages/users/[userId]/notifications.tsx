import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import GlobalHeader from 'components/GlobalHeader';
import LoadingCircular from 'components/LoadingCircular/LoadingCircular';
import Meta from 'components/Meta';
import NotificationItem from 'components/NotificationItem/NotificationItem';
import useNotifications from 'hooks/api/useNotifications';
import useNotificationsCount from 'hooks/api/useNotificationsCount';
import useAuth from 'hooks/auth/useAuth';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';

const ITEM_COUNT_PER_PAGE = 20;

const Notifications = () => {
  const { user } = useAuth();

  const [page, setPage] = useState(1);

  const {
    data: notificationsData,
    isLoading,
    isError,
  } = useNotifications({
    userId: user?._id,
    skip: (page - 1) * ITEM_COUNT_PER_PAGE,
    limit: ITEM_COUNT_PER_PAGE,
  });

  const { data: notificationsCountData } = useNotificationsCount({
    userId: user?._id,
  });

  const isEmpty = !isLoading && notificationsData?.notifications.length === 0;

  const handlePageChange = (page: number) => {
    window.scrollTo({ top: 0 });
    setPage(page);
  };

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
        <Box display="flex" justifyContent="center">
          {(notificationsCountData?.count ?? 0) <=
          ITEM_COUNT_PER_PAGE ? null : (
            <Pagination
              page={page}
              onChange={(_, page) => handlePageChange(page)}
              count={Math.ceil(
                Number(notificationsCountData?.count) / ITEM_COUNT_PER_PAGE
              )}
            />
          )}
        </Box>
      </Container>
    </>
  );
};

export default Notifications;
