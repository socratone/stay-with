import Box from '@mui/material/Box';
import GlobalHeader from 'components/GlobalHeader';
import { GLOBAL_HEADER_HEIGHT } from 'components/GlobalHeader/constants';
import Meta from 'components/Meta/Meta';
import ArrowHistories from 'feature/candle/CandleHistories';
import Candles from 'feature/candle/Candles';
import Image from 'next/image';
import crossImage from 'public/images/cross.webp';
import { useEffect, useRef, useState } from 'react';

const Arrows = () => {
  const candlesContainerRef = useRef<HTMLDivElement>(null);
  const [viewportHeight, setViewportHeight] = useState<number | null>(null);

  // viewport height를 계산한 이후에 scroll 이동
  useEffect(() => {
    if (viewportHeight && candlesContainerRef.current) {
      window.scrollTo({
        top: candlesContainerRef.current.offsetHeight,
        behavior: 'smooth',
      });
    }
  }, [viewportHeight]);

  // viewport height를 계산
  useEffect(() => {
    const viewportHeight = window.innerHeight;
    setViewportHeight(viewportHeight);
  }, []);

  const getCandlesHeight = () => {
    const initialHeight = '100vh';
    const calculatedHeight = `${viewportHeight}px`;
    const height = viewportHeight ? calculatedHeight : initialHeight;
    return `calc(${height} - ${GLOBAL_HEADER_HEIGHT})`;
  };

  return (
    <>
      <Meta />
      <GlobalHeader dark />
      <Box
        display="flex"
        justifyContent="center"
        height={`calc(100vh - ${GLOBAL_HEADER_HEIGHT})`}
        bgcolor="#000"
        py={2}
      >
        <Box position="relative" sx={{ aspectRatio: '720 / 960' }}>
          <Image
            src={crossImage}
            alt="cross"
            fill
            style={{ objectFit: 'contain' }}
          />
        </Box>
      </Box>
      <Box ref={candlesContainerRef} height={getCandlesHeight()}>
        <Candles />
      </Box>
      <ArrowHistories />
    </>
  );
};

export default Arrows;
