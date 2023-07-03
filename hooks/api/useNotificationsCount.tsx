import { useQuery } from '@tanstack/react-query';
import {
  getNotificationsCount,
  GetNotificationsCountParams,
} from 'helpers/axios';

export const NOTIFICATIONS_COUNT_QUERY_KEY = 'notifications-count';

const useNotificationsCount = (params?: GetNotificationsCountParams) => {
  return useQuery({
    queryKey: [NOTIFICATIONS_COUNT_QUERY_KEY, params],
    queryFn: () => getNotificationsCount(params),
    enabled: !!params?.userId,
  });
};

export default useNotificationsCount;
