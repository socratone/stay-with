import { useQuery } from '@tanstack/react-query';
import { getLexioDivinas, GetLexioDivinasParams } from 'helpers/axios';

type Options = {
  enabled?: boolean;
};

export const LEXIO_DIVINAS_QUERY_KEY = 'lexio-divinas';

const useLexioDivinas = (params?: GetLexioDivinasParams, options?: Options) => {
  return useQuery({
    queryKey: [LEXIO_DIVINAS_QUERY_KEY, params],
    queryFn: () => getLexioDivinas(params),
    enabled: options?.enabled,
  });
};

export default useLexioDivinas;
