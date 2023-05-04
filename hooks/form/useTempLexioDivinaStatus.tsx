import { useAppSelector } from 'redux/hooks';

type UseTempLexioDivinaStatusReturn = {
  id?: string;
  status: 'edit' | 'create' | 'none';
};

const isEmptyObjectExceptId = (object: object) => {
  return !Object.entries(object)
    .filter(([key]) => key !== 'id')
    .some(([, value]) => !!value);
};

const useTempLexioDivinaStatus = (): UseTempLexioDivinaStatusReturn => {
  const tempLexioDivina = useAppSelector((state) => state.tempLexioDivina);

  if (tempLexioDivina.id) {
    return {
      id: tempLexioDivina.id,
      status: 'edit',
    };
  }

  if (isEmptyObjectExceptId(tempLexioDivina)) {
    return {
      status: 'none',
    };
  }

  return {
    status: 'create',
  };
};

export default useTempLexioDivinaStatus;
