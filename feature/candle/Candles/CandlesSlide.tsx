import 'swiper/css';

import Box from '@mui/material/Box';
import useAuth from 'hooks/auth/useAuth';
import { useRef } from 'react';
import { parseBoardToArrayWithCoordinate } from 'utils/board';

import CandleItem, { CANDLE_HEIGHT } from './CandleItem';
import { getRandomCandleImageSrc } from './helpers';
import { Candle } from './types';

type CandlesSlideProps = {
  board: (Candle | null)[][];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

const ROW_OFFSET = 0.5 * CANDLE_HEIGHT;

const CandlesSlide: React.FC<CandlesSlideProps> = ({
  board,
  onEdit,
  onDelete,
}) => {
  const { user: me } = useAuth();
  const divRef = useRef<HTMLDivElement>(null);
  const candles = parseBoardToArrayWithCoordinate(board);

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
        {candles.map((candle, index) => (
          <CandleItem
            key={candle._id}
            row={candle.row}
            column={candle.column}
            rowOffset={candle.column % 2 === 0 ? ROW_OFFSET : undefined}
            imageSrc={getRandomCandleImageSrc(index)}
            message={candle.message}
            name={candle.user?.name}
            profileImageUrl={candle.user?.imageUrl}
            createdAt={candle.createdAt}
            isMyself={candle.userId === me?._id}
            onEdit={() => onEdit(candle._id)}
            onDelete={() => onDelete(candle._id)}
          />
        ))}
      </Box>
    </>
  );
};

export default CandlesSlide;
