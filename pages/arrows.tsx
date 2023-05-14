import { styled } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import GlobalHeader from 'components/GlobalHeader/GlobalHeader';
import Meta from 'components/Meta/Meta';
import ThemeProvider from 'contexts/ThemeProvider';
import { useRef, useState } from 'react';
import { useMount } from 'react-use';
import {
  addCoordinateFrom2DArray,
  assignTruthyValues,
  create2DArray,
} from 'utils/array';

// TODO: api 생성
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

  const [message, setMessage] = useState('');

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

  // TODO: message 정보 등이 표시 되도록 개선
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

  // TODO: viewport가 변할 때마다 갱신
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

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
  };

  const handleSubmit = () => {
    // TODO: send message
  };

  return (
    <ThemeProvider colorMode="dark">
      <Box height="100vh" display="flex" flexDirection="column">
        <Meta />
        <GlobalHeader colorMode="dark" />
        <StyledBox
          ref={divRef}
          flexGrow={1}
          sx={{ bgcolor: 'black', position: 'relative' }}
        />
        <Stack
          direction="row"
          p={1}
          position="relative"
          justifyContent="center"
          sx={{ bgcolor: 'black' }}
        >
          <TextField
            value={message}
            onChange={handleChange}
            size="small"
            fullWidth
            multiline
            sx={{
              maxWidth: 300,
            }}
          />
          <Button size="small" onClick={handleSubmit}>
            저장
          </Button>
        </Stack>
      </Box>
    </ThemeProvider>
  );
};

export default Arrows;
