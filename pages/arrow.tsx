/* eslint-disable prefer-spread */
import { styled } from '@mui/material';
import Box from '@mui/material/Box';
import GlobalHeader from 'components/GlobalHeader/GlobalHeader';
import Meta from 'components/Meta/Meta';
import { useRef } from 'react';
import { useMount } from 'react-use';
import { getAscendNumbers } from 'utils/array';

const StyledBox = styled(Box)`
  .stars {
    position: absolute;
    background: gold;
    z-index: 18;
    border-radius: 100%;
  }
`;

const Arrow = () => {
  const divRef = useRef<HTMLDivElement>(null);

  const randomFrom = (array: number[]) => {
    return array[Math.floor(Math.random() * array.length)];
  };

  const bigRange = getAscendNumbers(100);
  const smallRange = getAscendNumbers(3);

  const drawStar = () => {
    const top = randomFrom(bigRange);
    const right = randomFrom(bigRange);
    const width = randomFrom(smallRange);

    if (divRef.current) {
      divRef.current.insertAdjacentHTML(
        'beforeend',
        `<div class="stars" style="top: ${top}%; right: ${right}%; width: ${width}px; height: ${width}px; box-shadow: 0px 0px 1vw rgba(255, 255, 255, 0.2);"></div>`
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

export default Arrow;
