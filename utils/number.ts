export const generateRandomNumber = (minNumer: number, maxNumber: number) => {
  return Math.floor(Math.random() * (maxNumber - minNumer + 1)) + minNumer;
};
