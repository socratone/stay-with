import { getLexioDivinas, GetLexioDivinasParams } from 'libs/axios/apis';
import { useQuery } from 'react-query';

const useLexioDivinas = (params?: GetLexioDivinasParams) => {
  return useQuery(
    [params, '/api/lexio-divinas'],
    () => getLexioDivinas(params),
    {
      keepPreviousData: true,
    }
  );
};

export default useLexioDivinas;
