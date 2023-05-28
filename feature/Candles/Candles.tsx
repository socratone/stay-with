import 'swiper/css';

import Box from '@mui/material/Box';
import useArrowsCount from 'hooks/api/useArrowsCount';
import range from 'lodash/range';
import { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

import CandlesSlide from './CandlesSlide';
import { Candle } from './types';
import useCandlesRowColumnCount from './useCandlesRowColumnCount';

type CandlesProps = {
  additionalCandles: Candle[];
};

const Candles: React.FC<CandlesProps> = ({ additionalCandles }) => {
  const divRef = useRef<HTMLDivElement>(null);

  const { data: arrowsCountData } = useArrowsCount();

  const { rowCount, columnCount } = useCandlesRowColumnCount({ ref: divRef });
  const maxCandleCount =
    rowCount && columnCount
      ? Math.round(columnCount * rowCount * 0.4)
      : undefined;

  const paginationCount =
    arrowsCountData && maxCandleCount
      ? Math.ceil(arrowsCountData.count / maxCandleCount)
      : 0;

  return (
    <Box
      ref={divRef}
      flexGrow={1}
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{
        bgcolor: '#000',
        position: 'relative',
        '> .swiper': {
          width: '100%',
          height: '100%',
        },
      }}
    >
      <Swiper>
        {range(paginationCount).map((_, index) => (
          <SwiperSlide key={index}>
            <CandlesSlide
              additionalCandles={index === 0 ? additionalCandles : undefined}
              index={index}
              maxCount={maxCandleCount}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
};

export default Candles;
