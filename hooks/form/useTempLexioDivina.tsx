import { useAppSelector } from 'redux/hooks';

const useTempLexioDivina = () => {
  return useAppSelector((state) => state.tempLexioDivina);
};

export default useTempLexioDivina;
