import Box from '@mui/material/Box';
import GlobalHeader from 'components/GlobalHeader';
import { GLOBAL_HEADER_HEIGHT } from 'components/GlobalHeader/constants';
import Meta from 'components/Meta/Meta';
import ArrowHistories from 'feature/candle/CandleHistories';
import Candles from 'feature/candle/Candles';
import useRemToPxNumber from 'hooks/theme/useRemToPxNumer';
import Image from 'next/image';
import crossImage from 'public/images/cross.webp';
import { useEffect, useRef, useState } from 'react';

const CROSS_IMAGE_WIDTH = 720;
const CROSS_IMAGE_HEIGHT = 960;

const Arrows = () => {
  const globalHeaderHeight = useRemToPxNumber(GLOBAL_HEADER_HEIGHT);
  const candlesContainerRef = useRef<HTMLDivElement>(null);
  const [viewportHeight, setViewportHeight] = useState<number | null>(null);

  useEffect(() => {
    const viewportHeight = window.innerHeight;
    setViewportHeight(viewportHeight);
  }, []);

  // viewport height를 계산한 이후에 scroll 이동
  useEffect(() => {
    if (viewportHeight && candlesContainerRef.current) {
      window.scrollTo({
        top: candlesContainerRef.current.offsetHeight,
        behavior: 'smooth',
      });
    }
  }, [viewportHeight]);

  const getCandlesHeight = () => {
    const initialHeight = '100vh';
    const calculatedHeight = `${viewportHeight}px`;
    const height = viewportHeight ? calculatedHeight : initialHeight;
    return `calc(${height} - ${GLOBAL_HEADER_HEIGHT})`;
  };

  // 이미지의 위쪽 부분이 잘리지 않도록
  const getMaxWidth = () => {
    if (viewportHeight) {
      const elementHeight = viewportHeight - globalHeaderHeight;
      return (elementHeight * CROSS_IMAGE_WIDTH) / CROSS_IMAGE_HEIGHT; // ratio
    }
  };

  return (
    <>
      <Meta />
      <GlobalHeader dark />
      <Box height={`calc(100vh - ${GLOBAL_HEADER_HEIGHT})`} bgcolor="#000">
        <Box
          position="relative"
          height="100%"
          maxWidth={getMaxWidth()}
          mx="auto"
        >
          <Image
            src={crossImage}
            alt="cross"
            fill
            style={{ objectFit: 'cover' }}
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
