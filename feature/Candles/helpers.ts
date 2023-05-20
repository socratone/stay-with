export const getRandomCandleImageSrc = (index: number) => {
  const order = index % 8;
  switch (order) {
    case 0:
      return '/candle.gif';
    case 1:
      return '/candle-flip-offset-1.gif';
    case 2:
      return '/candle-offset-2.gif';
    case 3:
      return '/candle-flip-offset-3.gif';
    case 4:
      return '/candle-offset-4.gif';
    case 5:
      return '/candle-flip-offset-5.gif';
    case 6:
      return '/candle-offset-6.gif';
    case 7:
    default:
      return '/candle-flip-offset-7.gif';
  }
};
