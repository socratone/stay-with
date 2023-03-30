import { useQuery } from '@tanstack/react-query';
import { getLexioDivina } from 'helpers/axios';

const useLexioDivina = (id?: string) => {
  return useQuery({
    queryKey: ['/api/lexio-divinas', id],
    queryFn: () => getLexioDivina(id as string),
    enabled: !!id,
  });
};

export default useLexioDivina;
