import { useQuery } from '@tanstack/react-query';
import { getUser } from 'helpers/axios';

const useUser = (id?: string) => {
  return useQuery({
    queryKey: ['/api/users', id],
    queryFn: () => getUser(id as string),
    enabled: !!id,
  });
};

export default useUser;
