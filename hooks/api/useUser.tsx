import { getUser } from 'libs/axios/apis';
import { useQuery } from 'react-query';

const useUser = (id?: string) => {
  return useQuery([id, '/api/users'], () => getUser(id as string), {
    enabled: !!id,
  });
};

export default useUser;
