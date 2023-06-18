import Box from '@mui/material/Box';
import { GLOBAL_HEADER_HEIGHT } from 'components/GlobalHeader/constants';
import GlobalHeader from 'components/GlobalHeader/GlobalHeader';
import Meta from 'components/Meta/Meta';
import Candles from 'feature/Candles';
import Image from 'next/image';
import crossImage from 'public/images/cross.webp';
import { useEffect, useRef } from 'react';

const Arrows = () => {
  const candlesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (candlesContainerRef.current) {
      candlesContainerRef.current.scrollIntoView();
    }
  }, []);

  return (
    <>
      <Meta />
      <GlobalHeader dark />
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
      <Box
        ref={candlesContainerRef}
        height={`calc(100vh - ${GLOBAL_HEADER_HEIGHT})`}
      >
        <Candles />
      </Box>
    </>
  );
};

export default Arrows;
