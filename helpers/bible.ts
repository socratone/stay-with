import { Bible, NEW_TESTAMENTS } from 'constants/bible';

export const isNewTestament = (bible: Bible) => {
  return NEW_TESTAMENTS.some((newTestament) => newTestament === bible);
};
