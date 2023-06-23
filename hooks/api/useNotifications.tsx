import { useQuery } from '@tanstack/react-query';
import { getNotifications, GetNotificationsParams } from 'helpers/axios';

const USE_NOTIFICATIONS_QUERY_KEY = 'USE_NOTIFICATIONS_QUERY_KEY';

const useNotifications = (params: GetNotificationsParams) => {
  return useQuery({
    queryKey: [USE_NOTIFICATIONS_QUERY_KEY, params],
    queryFn: () => getNotifications(params),
    enabled: !!params.userId,
  });
};

export default useNotifications;
