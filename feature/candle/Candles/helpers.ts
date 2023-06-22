export const getRandomCandleImageSrc = (index: number) => {
  const order = index % 8;
  switch (order) {
    case 0:
      return '/images/candle.gif';
    case 1:
      return '/images/candle-flip-offset-1.gif';
    case 2:
      return '/images/candle-offset-2.gif';
    case 3:
      return '/images/candle-flip-offset-3.gif';
    case 4:
      return '/images/candle-offset-4.gif';
    case 5:
      return '/images/candle-flip-offset-5.gif';
    case 6:
      return '/images/candle-offset-6.gif';
    case 7:
    default:
      return '/images/candle-flip-offset-7.gif';
  }
};
