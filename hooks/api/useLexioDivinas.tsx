import { useQuery } from '@tanstack/react-query';
import { getLexioDivinas, GetLexioDivinasParams } from 'helpers/axios';

export const LEXIO_DIVINAS_QUERY_KEY = 'lexio-divinas';

const useLexioDivinas = (
  params?: GetLexioDivinasParams & { enabled?: boolean }
) => {
  return useQuery({
    queryKey: [LEXIO_DIVINAS_QUERY_KEY, params],
    queryFn: () => getLexioDivinas(params),
    keepPreviousData: true,
    enabled: params?.enabled,
  });
};

export default useLexioDivinas;
