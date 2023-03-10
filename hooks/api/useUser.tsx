import { getUser } from 'helpers/axios';
import { useQuery } from 'react-query';

const useUser = (id?: string) => {
  return useQuery([id, '/api/users'], () => getUser(id as string), {
    enabled: !!id,
  });
};

export default useUser;
