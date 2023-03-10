import { getLexioDivina } from 'helpers/axios';
import { useQuery } from 'react-query';

const useLexioDivina = (id?: string) => {
  return useQuery(
    [id, '/api/lexio-divinas'],
    () => getLexioDivina(id as string),
    {
      enabled: !!id,
    }
  );
};

export default useLexioDivina;
