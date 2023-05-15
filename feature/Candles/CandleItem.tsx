import Box from '@mui/material/Box';
import Image, { ImageProps } from 'next/image';

type CandleItemProps = {
  imageSrc: ImageProps['src'];
  row: number;
  column: number;
};

export const CANDLE_WIDTH = 10;
export const CANDLE_HEIGHT = 24;

const CandleItem: React.FC<CandleItemProps> = ({ imageSrc, row, column }) => {
  return (
    <Box
      width={CANDLE_WIDTH}
      height={CANDLE_HEIGHT}
      sx={{
        position: 'absolute',
        top: row * CANDLE_HEIGHT,
        left: column * CANDLE_WIDTH,
      }}
    >
      <Image
        src={imageSrc}
        alt="small candle"
        width={CANDLE_WIDTH}
        height={CANDLE_HEIGHT}
        style={{
          objectFit: 'contain',
        }}
      />
    </Box>
  );
};

export default CandleItem;
