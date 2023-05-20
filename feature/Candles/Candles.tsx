import 'swiper/css';

import Box from '@mui/material/Box';
import useResizeListener from 'hooks/dom/useResizeListener';
import range from 'lodash/range';
import { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

import CandlesSlide from './CandlesSlide';
import { Candle } from './types';

type CandlesProps = {
  additionalCandles: Candle[];
};

const Candles: React.FC<CandlesProps> = ({ additionalCandles }) => {
  const divRef = useRef<HTMLDivElement>(null);

  const [resizedCount, setResizedCount] = useState(0);

  useResizeListener({
    onResize: () => setResizedCount((count) => count + 1),
  });

  // TODO: fetch data for pagination
  const pageLength = 2;

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
        {range(pageLength).map((_, index) => (
          <SwiperSlide key={index}>
            <CandlesSlide
              additionalCandles={index === 0 ? additionalCandles : undefined}
              index={index}
              resizedCount={resizedCount}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
};

export default Candles;
