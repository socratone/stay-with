import Box from '@mui/material/Box';
import { GLOBAL_HEADER_HEIGHT } from 'components/GlobalHeader/constants';
import ArrowHistories from 'feature/candle/CandleHistories';
import Candles from 'feature/candle/Candles';
import useRemToPxNumber from 'hooks/theme/useRemToPxNumer';
import Image from 'next/image';
import crossImage from 'public/images/cross.webp';
import { useEffect, useRef, useState } from 'react';

const Arrows = () => {
  const globalHeaderHeight = useRemToPxNumber(GLOBAL_HEADER_HEIGHT);
  const candlesContainerRef = useRef<HTMLDivElement>(null);
  const [viewportHeight, setViewportHeight] = useState<number | null>(null);

  useEffect(() => {
    const viewportHeight = window.innerHeight;
    setViewportHeight(viewportHeight);

    window.scrollTo({
      top: viewportHeight - globalHeaderHeight,
      behavior: 'smooth',
    });
  }, [globalHeaderHeight]);

  const getCandlesHeight = () => {
    const initialHeight = '100vh';
    const calculatedHeight = `${viewportHeight}px`;
    // candles height가 달라지는 이슈 방지
    const height = viewportHeight ? calculatedHeight : initialHeight;
    return `calc(${height} - ${GLOBAL_HEADER_HEIGHT})`;
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="center"
        position="relative"
        height={`calc(100vh - ${GLOBAL_HEADER_HEIGHT})`}
        bgcolor="#000"
      >
        <Image
          src={crossImage}
          alt="cross"
          fill
          style={{ objectFit: 'contain' }}
        />
      </Box>
      <Box ref={candlesContainerRef} height={getCandlesHeight()}>
        <Candles />
      </Box>
      <ArrowHistories />
    </>
  );
};

export default Arrows;
