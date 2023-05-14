/* eslint-disable prefer-spread */

export const getAscendNumbers = (length: number) => {
  return Array.apply(null, Array(length)).map((_, index) => {
    return index;
  });
};

export const randomFrom = (array: number[]) => {
  return array[Math.floor(Math.random() * array.length)];
};
