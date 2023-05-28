import { keyframes } from '@emotion/react';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Zoom from '@mui/material/Zoom';
import Image, { ImageProps } from 'next/image';
import { useRef, useState } from 'react';
import { generateRandomNumber } from 'utils/number';

type CandleItemProps = {
  imageSrc: ImageProps['src'];
  row: number;
  column: number;
  rowOffset?: number;
  message: string;
  name?: string;
  profileUrl?: string;
  isMyself: boolean;
  onEdit: () => void;
  onDelete: () => void;
};

export const CANDLE_WIDTH = 10 * 2;
export const CANDLE_HEIGHT = 24 * 2;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const CandleItem: React.FC<CandleItemProps> = ({
  imageSrc,
  row,
  column,
  rowOffset = 0,
  message,
  name,
  profileUrl,
  isMyself,
  onEdit,
  onDelete,
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
    <ClickAwayListener onClickAway={closeTooltip}>
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
            {isMyself ? (
              <Stack direction="row">
                <IconButton size="small" onClick={onEdit}>
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={onDelete}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Stack>
            ) : null}
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
            animation: `${fadeIn} 1s ease `,
            img: {
              transform: `scale(${generateRandomNumber(85, 100) * 0.01})`,
            },
          }}
          onClick={openTooltip}
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
    </ClickAwayListener>
  );
};

export default CandleItem;
