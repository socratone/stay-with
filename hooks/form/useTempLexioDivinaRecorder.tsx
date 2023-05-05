import { LexioDivinaFormValues } from 'components/LexioDivinaForm/LexioDivinaForm';
import { useDebounce } from 'react-use';
import { useAppDispatch } from 'redux/hooks';
import {
  resetTempLexioDivina,
  setTempLexioDivina,
} from 'redux/tempLexioDivinaSlice';

type UseTempLexioDivinaRecorderParams = {
  value: LexioDivinaFormValues;
  id?: string;
  enabled: boolean;
};

const useTempLexioDivinaRecorder = ({
  value,
  id,
  enabled,
}: UseTempLexioDivinaRecorderParams) => {
  const dispatch = useAppDispatch();

  const stringifiedValue = JSON.stringify(value);

  useDebounce(
    () => {
      if (enabled) {
        dispatch(setTempLexioDivina({ ...value, id }));
      }
    },
    1000,
    [stringifiedValue]
  );

  const reset = () => {
    dispatch(resetTempLexioDivina());
  };

  return {
    reset,
  };
};

export default useTempLexioDivinaRecorder;
