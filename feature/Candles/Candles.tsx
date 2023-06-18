import 'swiper/css';

import Box from '@mui/material/Box';
import useArrowsCount from 'hooks/api/useArrowsCount';
import range from 'lodash/range';
import { useRef, useState } from 'react';
import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react';

import CandlesSlide from './CandlesSlide';
import { useCandlesRowColumnCount } from './hooks';

const Candles: React.FC = () => {
  const divRef = useRef<HTMLDivElement>(null);

  const [page, setPage] = useState(1);

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

  const handleSlideChange = (swiper: SwiperClass) => {
    setPage(swiper.activeIndex + 1);
  };

  return (
    <Box
      ref={divRef}
      sx={{
        height: '100%',
        bgcolor: '#000',
        position: 'relative',
        '> .swiper': {
          width: '100%',
          height: '100%',
        },
      }}
    >
      <Swiper onSlideChange={handleSlideChange}>
        {range(paginationCount).map((_, index) => (
          <SwiperSlide key={index}>
            <CandlesSlide
              index={index}
              maxCount={maxCandleCount}
              enabled={page >= index}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
};

export default Candles;
