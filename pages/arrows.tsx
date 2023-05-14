/* eslint-disable prefer-spread */
import { styled } from '@mui/material';
import Box from '@mui/material/Box';
import GlobalHeader from 'components/GlobalHeader/GlobalHeader';
import Meta from 'components/Meta/Meta';
import { useRef } from 'react';
import { useMount } from 'react-use';
import { getAscendNumbers } from 'utils/array';

const StyledBox = styled(Box)`
  .candle {
    position: absolute;
    z-index: 10;
    width: 10px;
    display: block;
    transform: translate(-50%, -50%);
  }
`;

const Arrows = () => {
  const divRef = useRef<HTMLDivElement>(null);

  const randomFrom = (array: number[]) => {
    return array[Math.floor(Math.random() * array.length)];
  };

  const bigRange = getAscendNumbers(100);

  const getRandomCandleImageSrc = (index: number) => {
    const order = index % 8;
    switch (order) {
      case 0:
        return '/candle.gif';
      case 1:
        return '/candle-flip-offset-1.gif';
      case 2:
        return '/candle-offset-2.gif';
      case 3:
        return '/candle-flip-offset-3.gif';
      case 4:
        return '/candle-offset-4.gif';
      case 5:
        return '/candle-flip-offset-5.gif';
      case 6:
        return '/candle-offset-6.gif';
      case 7:
      default:
        return '/candle-flip-offset-7.gif';
    }
  };

  const drawStar = (index: number) => {
    const top = randomFrom(bigRange);
    const left = randomFrom(bigRange);

    if (divRef.current) {
      divRef.current.insertAdjacentHTML(
        'beforeend',
        `<img src="${getRandomCandleImageSrc(
          index
        )}" alt="small candle" class="candle" style="top: ${top}%; left: ${left}%;"></div>`
      );
    }
  };

  useMount(() => {
    for (let i = 0; i < 100; i++) {
      drawStar(i);
    }
  });

  return (
    <Box height="100vh" display="flex" flexDirection="column">
      <Meta />
      <GlobalHeader />
      <StyledBox
        ref={divRef}
        flexGrow={1}
        sx={{ bgcolor: 'black', position: 'relative' }}
      />
    </Box>
  );
};

export default Arrows;
