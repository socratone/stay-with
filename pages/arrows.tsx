/* eslint-disable prefer-spread */
import { styled } from '@mui/material';
import Box from '@mui/material/Box';
import GlobalHeader from 'components/GlobalHeader/GlobalHeader';
import Meta from 'components/Meta/Meta';
import { useRef } from 'react';
import { useMount } from 'react-use';
import {
  addCoordinateFrom2DArray,
  assignTruthyValues,
  create2DArray,
} from 'utils/array';

const MOCK_VALUES = [
  { name: 'John', message: 'pray 1' },
  { name: 'John', message: 'pray 2' },
  { name: 'John', message: 'pray 3' },
  { name: 'John', message: 'pray 4' },
];

const CANDLE_WIDTH = 10;
const CANDLE_HEIGHT = 24;

const StyledBox = styled(Box)`
  .candle {
    position: absolute;
    z-index: 10;
    width: ${CANDLE_WIDTH}px;
    display: block;

    :hover {
      transform: scale(2);
      transition: all 0.3s ease;
    }
  }
`;

const Arrows = () => {
  const divRef = useRef<HTMLDivElement>(null);

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

  const drawCandle = (row: number, column: number, index: number) => {
    if (divRef.current) {
      divRef.current.insertAdjacentHTML(
        'beforeend',
        `<img src="${getRandomCandleImageSrc(
          index
        )}" alt="small candle" class="candle" style="top: ${
          row * CANDLE_HEIGHT
        }px; left: ${column * CANDLE_WIDTH}px;">`
      );
    }
  };

  useMount(() => {
    const screen = divRef.current;

    if (screen) {
      const screenWidth = screen.offsetWidth;
      const screenHeight = screen.offsetHeight;
      const columnColunt = Math.floor(screenWidth / CANDLE_WIDTH);
      const rowColunt = Math.floor(screenHeight / CANDLE_HEIGHT);

      const array = create2DArray(rowColunt, columnColunt);
      assignTruthyValues(array, MOCK_VALUES.length);
      const candles = addCoordinateFrom2DArray(MOCK_VALUES, array);
      candles.map((candle, index) => {
        drawCandle(candle.row, candle.column, index);
      });
    }
  });

  return (
    <Box height="100vh" display="flex" flexDirection="column">
      <Meta />
      <GlobalHeader colorMode="dark" />
      <StyledBox
        ref={divRef}
        flexGrow={1}
        sx={{ bgcolor: 'black', position: 'relative' }}
      />
    </Box>
  );
};

export default Arrows;
