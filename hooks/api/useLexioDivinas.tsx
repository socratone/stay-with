import { useQuery } from '@tanstack/react-query';
import { getLexioDivinas, GetLexioDivinasParams } from 'helpers/axios';

const useLexioDivinas = (params?: GetLexioDivinasParams) => {
  return useQuery({
    queryKey: ['/api/lexio-divinas', params],
    queryFn: () => getLexioDivinas(params),
    keepPreviousData: true,
  });
};

export default useLexioDivinas;
