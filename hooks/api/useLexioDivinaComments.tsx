import { useQuery } from '@tanstack/react-query';
import { getCommentsInLexioDivina } from 'helpers/axios';

export const LEXIO_DIVINA_COMMENTS_QUERY_KEY = 'lexio-divina-comments';

const useLexioDivinaComments = (id?: string) => {
  return useQuery({
    queryKey: [LEXIO_DIVINA_COMMENTS_QUERY_KEY, id],
    queryFn: () => getCommentsInLexioDivina(id as string),
    keepPreviousData: true,
    enabled: !!id,
  });
};

export default useLexioDivinaComments;
