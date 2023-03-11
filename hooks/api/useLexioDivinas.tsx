import { getLexioDivinas, GetLexioDivinasParams } from 'helpers/axios';
import { useQuery } from 'react-query';

const useLexioDivinas = (params?: GetLexioDivinasParams) => {
  return useQuery(
    ['/api/lexio-divinas', params],
    () => getLexioDivinas(params),
    {
      keepPreviousData: true,
    }
  );
};

export default useLexioDivinas;
