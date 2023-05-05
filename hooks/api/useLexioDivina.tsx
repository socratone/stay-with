import { useQuery } from '@tanstack/react-query';
import { getLexioDivina } from 'helpers/axios';

export const LEXIO_DIVINA_QUERY_KEY = 'lexio-divina';

const useLexioDivina = (id?: string) => {
  return useQuery({
    queryKey: [LEXIO_DIVINA_QUERY_KEY, id],
    queryFn: () => getLexioDivina(id as string),
    enabled: !!id,
  });
};

export default useLexioDivina;
