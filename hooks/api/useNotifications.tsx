import { useQuery } from '@tanstack/react-query';
import { getNotifications, GetNotificationsParams } from 'helpers/axios';

export const NOTIFICATIONS_QUERY_KEY = 'NOTIFICATIONS_QUERY_KEY';

const useNotifications = (params: GetNotificationsParams) => {
  return useQuery({
    queryKey: [NOTIFICATIONS_QUERY_KEY, params],
    queryFn: () => getNotifications(params),
    enabled: !!params.userId,
  });
};

export default useNotifications;
