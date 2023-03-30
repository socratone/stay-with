import { useQuery } from '@tanstack/react-query';
import { getLexioDivina } from 'helpers/axios';

const useLexioDivina = (id?: string) => {
  return useQuery({
    queryKey: [id, '/api/lexio-divinas'],
    queryFn: () => getLexioDivina(id as string),
    enabled: !!id,
  });
};

export default useLexioDivina;
