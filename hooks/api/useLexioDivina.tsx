import { useQuery } from '@tanstack/react-query';
import { getLexioDivina } from 'helpers/axios';

export const LEXIO_DIVINA_QUERY_KEY = 'lexio-divina';

type UseLexioDivinaOptions = {
  onError?: (error: any) => void;
};

const useLexioDivina = (
  id?: string | null,
  options?: UseLexioDivinaOptions
) => {
  return useQuery({
    queryKey: [LEXIO_DIVINA_QUERY_KEY, id],
    queryFn: () => getLexioDivina(id as string),
    enabled: !!id,
    onError: options?.onError,
  });
};

export default useLexioDivina;
