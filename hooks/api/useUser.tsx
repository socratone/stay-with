import { getUser } from 'helpers/axios';
import { useQuery } from 'react-query';

const useUser = (id?: string) => {
  return useQuery(['/api/users', id], () => getUser(id as string), {
    enabled: !!id,
  });
};

export default useUser;
