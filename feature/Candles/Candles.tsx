import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import ErrorMessage from 'components/ErrorMessage/ErrorMessage';
import useArrows from 'hooks/api/useArrows';
import useResizeListener from 'hooks/dom/useResizeListener';
import { cloneDeep } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { Arrow, User } from 'types/document';
import {
  assignValue,
  assignValues,
  createEmptyBoard,
  parseBoardToArrayWithCoordinate,
} from 'utils/board';

import CandleItem, { CANDLE_HEIGHT, CANDLE_WIDTH } from './CandleItem';

const getRandomCandleImageSrc = (index: number) => {
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

export type Candle = Partial<Arrow> & {
  user?: User;
  createdAt?: Date;
};

type CandlesProps = {
  additionalCandles: Candle[];
};

const Candles: React.FC<CandlesProps> = ({ additionalCandles }) => {
  const divRef = useRef<HTMLDivElement>(null);

  const [resizedCount, setResizedCount] = useState(0);
  const [board, setBoard] = useState<(Candle | null)[][]>([]);

  const {
    data: arrowsData,
    isLoading: arrowsLoading,
    isError: arrowsError,
  } = useArrows({
    skip: 0,
    limit: 50, // TODO: 페이지네이션
  });

  const candles = arrowsData ? parseBoardToArrayWithCoordinate(board) : [];

  useResizeListener({
    onResize: () => setResizedCount((count) => count + 1),
  });

  // data를 받아서 board에 넣는다.
  useEffect(() => {
    const screen = divRef.current;

    if (screen && arrowsData) {
      const screenWidth = screen.offsetWidth;
      const screenHeight = screen.offsetHeight;
      const columnColunt = Math.floor(screenWidth / CANDLE_WIDTH);
      const rowColunt = Math.floor(screenHeight / CANDLE_HEIGHT);

      const board = createEmptyBoard(rowColunt, columnColunt);
      assignValues(board, arrowsData.arrows);
      setBoard(board);
    }
  }, [arrowsData, resizedCount]);

  // message를 입력하여 candle이 추가되면 board에 넣는다.
  useEffect(() => {
    if (additionalCandles.length > 0) {
      const newAdditionalCandle =
        additionalCandles[additionalCandles.length - 1];

      setBoard((board) => {
        const newBoard = cloneDeep(board);
        assignValue(newBoard, newAdditionalCandle);
        return newBoard;
      });
    }
  }, [additionalCandles]);

  // TODO: swiper를 이용한 페이지네이션
  return (
    <Box
      ref={divRef}
      flexGrow={1}
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{ bgcolor: 'black', position: 'relative' }}
    >
      {arrowsLoading ? (
        <CircularProgress />
      ) : arrowsError ? (
        <ErrorMessage />
      ) : (
        candles.map((candle, index) => (
          <CandleItem
            key={candle._id}
            row={candle.row}
            column={candle.column}
            imageSrc={getRandomCandleImageSrc(index)}
          />
        ))
      )}
    </Box>
  );
};

export default Candles;
