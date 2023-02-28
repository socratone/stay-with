import { Bible, newTestaments } from 'constants/bible';

export const isNewTestament = (bible: Bible) => {
  return newTestaments.some((newTestament) => newTestament === bible);
};
