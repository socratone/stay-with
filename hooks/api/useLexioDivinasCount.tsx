import { useQuery } from '@tanstack/react-query';
import {
  getLexioDivinasCount,
  GetLexioDivinasCountParams,
} from 'helpers/axios';

export const LEXIO_DIVINAS_COUNT_QUERY_KEY = 'lexio-divinas-count';

const useLexioDivinasCount = (params?: GetLexioDivinasCountParams) => {
  return useQuery({
    queryKey: [LEXIO_DIVINAS_COUNT_QUERY_KEY, params],
    queryFn: () => getLexioDivinasCount(params),
  });
};

export default useLexioDivinasCount;
