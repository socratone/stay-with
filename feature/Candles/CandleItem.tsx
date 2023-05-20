import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Zoom from '@mui/material/Zoom';
import Image, { ImageProps } from 'next/image';
import { useRef, useState } from 'react';

type CandleItemProps = {
  imageSrc: ImageProps['src'];
  row: number;
  column: number;
  rowOffset?: number;
  message: string;
  name?: string;
  profileUrl?: string;
};

export const CANDLE_WIDTH = 10 * 2;
export const CANDLE_HEIGHT = 24 * 2;

const CandleItem: React.FC<CandleItemProps> = ({
  imageSrc,
  row,
  column,
  rowOffset = 0,
  message,
  name,
  profileUrl,
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  const closeTooltip = () => {
    setOpen(false);
  };

  const openTooltip = () => {
    setOpen(true);
    buttonRef.current?.focus();
  };

  return (
    <Tooltip
      title={
        <Stack spacing={0.5}>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Avatar src={profileUrl} sx={{ width: 24, height: 24 }} />
            <Box component="p">{name}</Box>
          </Stack>
          <Box component="p" whiteSpace="pre-line">
            {message}
          </Box>
        </Stack>
      }
      arrow
      TransitionComponent={Zoom}
      open={open}
    >
      <ButtonBase
        ref={buttonRef}
        sx={{
          width: CANDLE_WIDTH,
          height: CANDLE_HEIGHT,
          position: 'absolute',
          top: row * CANDLE_HEIGHT + rowOffset,
          left: column * CANDLE_WIDTH,
        }}
        onMouseEnter={openTooltip}
        onClick={openTooltip}
        onBlur={closeTooltip}
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
      </ButtonBase>
    </Tooltip>
  );
};

export default CandleItem;
