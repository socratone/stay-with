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

  const drawStar = () => {
    const top = randomFrom(bigRange);
    const left = randomFrom(bigRange);

    if (divRef.current) {
      divRef.current.insertAdjacentHTML(
        'beforeend',
        `<img src="/candle.gif" alt="small candle" class="candle" style="top: ${top}%; left: ${left}%;"></div>`
      );
    }
  };

  useMount(() => {
    for (let i = 0; i < 100; i++) {
      drawStar();
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
