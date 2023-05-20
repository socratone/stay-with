import 'swiper/css';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import ErrorMessage from 'components/ErrorMessage/ErrorMessage';
import useArrows from 'hooks/api/useArrows';
import cloneDeep from 'lodash/cloneDeep';
import { useEffect, useRef, useState } from 'react';
import {
  assignValue,
  assignValues,
  createEmptyBoard,
  parseBoardToArrayWithCoordinate,
} from 'utils/board';

import CandleItem, { CANDLE_HEIGHT, CANDLE_WIDTH } from './CandleItem';
import { getRandomCandleImageSrc } from './helpers';
import { Candle } from './types';

type CandlesSlideProps = {
  additionalCandles?: Candle[];
  index: number;
  resizedCount: number;
};

const COUNT_PER_SLIDE = 50;

const CandlesSlide: React.FC<CandlesSlideProps> = ({
  additionalCandles = [],
  index,
  resizedCount,
}) => {
  const divRef = useRef<HTMLDivElement>(null);
  const page = index + 1;

  const [board, setBoard] = useState<(Candle | null)[][]>([]);

  const {
    data: arrowsData,
    isLoading: arrowsLoading,
    isError: arrowsError,
  } = useArrows({
    skip: COUNT_PER_SLIDE * (page - 1),
    limit: COUNT_PER_SLIDE,
  });

  const candles = arrowsData ? parseBoardToArrayWithCoordinate(board) : [];

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

  return (
    <Box
      ref={divRef}
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        width: '100%',
        height: '100%',
      }}
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

export default CandlesSlide;
