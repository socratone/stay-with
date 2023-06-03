import 'swiper/css';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import ErrorMessage from 'components/ErrorMessage/ErrorMessage';
import useArrows from 'hooks/api/useArrows';
import useAuth from 'hooks/auth/useAuth';
import cloneDeep from 'lodash/cloneDeep';
import { useEffect, useRef, useState } from 'react';
import {
  assignValue,
  assignValues,
  createEmptyBoard,
  parseBoardToArrayWithCoordinate,
} from 'utils/board';

import CandleItem, { CANDLE_HEIGHT } from './CandleItem';
import { getRandomCandleImageSrc } from './helpers';
import { Candle } from './types';
import useCandlesRowColumnCount from './useCandlesRowColumnCount';

type CandlesSlideProps = {
  additionalCandles?: Candle[];
  index: number;
  maxCount?: number;
  enabled: boolean;
  selectedArrowId: string | null;
  onEdit: (candleId: string) => void;
  onDelete: (candleId: string) => void;
  onTooltipOpenChange: (open: boolean, candleId: string) => void;
};

const ROW_OFFSET = 0.5 * CANDLE_HEIGHT;

const CandlesSlide: React.FC<CandlesSlideProps> = ({
  additionalCandles = [],
  index,
  maxCount,
  enabled,
  selectedArrowId,
  onEdit,
  onDelete,
  onTooltipOpenChange,
}) => {
  const { user: me } = useAuth();
  const divRef = useRef<HTMLDivElement>(null);
  const page = index + 1;

  const [board, setBoard] = useState<(Candle | null)[][]>([]);

  const {
    data: arrowsData,
    isLoading: arrowsLoading,
    isError: arrowsError,
  } = useArrows(
    {
      skip: (maxCount ?? 0) * (page - 1),
      limit: maxCount ?? 0,
    },
    {
      enabled: enabled && !!maxCount,
    }
  );

  const candles = arrowsData ? parseBoardToArrayWithCoordinate(board) : [];

  const { rowCount, columnCount } = useCandlesRowColumnCount({ ref: divRef });

  useEffect(() => {
    if (arrowsData && rowCount && columnCount) {
      // data를 받아서 board에 넣는다.
      const board = createEmptyBoard(rowCount, columnCount);
      assignValues(board, arrowsData.arrows);
      setBoard(board);
    }
  }, [rowCount, columnCount, arrowsData]);

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
    <>
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
              rowOffset={candle.column % 2 === 0 ? ROW_OFFSET : undefined}
              imageSrc={getRandomCandleImageSrc(index)}
              message={candle.message}
              name={candle.user?.name}
              profileUrl={candle.user?.imageUrl}
              createdAt={candle.createdAt}
              isMyself={candle.userId === me?._id}
              onEdit={() => onEdit(candle._id)}
              onDelete={() => onDelete(candle._id)}
              tooltipOpen={selectedArrowId === candle._id}
              onTooltipOpenChange={(open) =>
                onTooltipOpenChange(open, candle._id)
              }
            />
          ))
        )}
      </Box>
    </>
  );
};

export default CandlesSlide;
