import useFontSize from './useFontSize';

const useRemToPxNumber = (rem: string) => {
  const remNumber = Number(rem.slice(0, -3));
  const { fontSizeNumber } = useFontSize();
  return remNumber * fontSizeNumber;
};

export default useRemToPxNumber;
