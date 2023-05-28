import useResizeListener from 'hooks/dom/useResizeListener';
import { RefObject, useEffect, useState } from 'react';

import { CANDLE_HEIGHT, CANDLE_WIDTH } from './CandleItem';

type UseCandlesRowColumnCountParams = {
  ref: RefObject<HTMLDivElement>;
};

const ROW_OFFSET = 0.5 * CANDLE_HEIGHT;

const useCandlesRowColumnCount = ({ ref }: UseCandlesRowColumnCountParams) => {
  const [rowCount, setRowCount] = useState<number>();
  const [columnCount, setColumnCount] = useState<number>();

  const calculateCount = () => {
    const screen = ref.current;

    if (screen) {
      const screenWidth = screen.offsetWidth;
      // ROW_OFFSET을 넣은 이유는 offset된 candle item이 bottom을 overflow하지 않도록
      const screenHeight = screen.offsetHeight - ROW_OFFSET;
      setColumnCount(Math.floor(screenWidth / CANDLE_WIDTH));
      setRowCount(Math.floor(screenHeight / CANDLE_HEIGHT));
    }
  };

  // init
  useEffect(calculateCount, [ref]);

  // when resized
  useResizeListener({
    onResize: calculateCount,
  });

  return {
    rowCount,
    columnCount,
  };
};

export default useCandlesRowColumnCount;
