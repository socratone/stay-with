import { keyframes } from '@emotion/react';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Zoom from '@mui/material/Zoom';
import Image, { ImageProps } from 'next/image';
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
  tooltipOpen: boolean;
  onTooltipOpenChange: (open: boolean) => void;
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
  tooltipOpen,
  onTooltipOpenChange,
}) => {
  return (
    <>
      <Tooltip
        title={
          <Stack gap={0.5}>
            <Stack direction="row" alignItems="center" gap={0.75}>
              <Avatar src={profileUrl} sx={{ width: 24, height: 24 }} />
              <Typography variant="body2">{name}</Typography>
            </Stack>
            <Typography
              variant="body2"
              whiteSpace="pre-line"
              color={(theme) => theme.palette.text.secondary}
            >
              {message}
            </Typography>
            {isMyself ? (
              <Stack direction="row" mx={-0.5} mb={-0.5}>
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
        open={tooltipOpen}
        componentsProps={{
          tooltip: {
            sx: {
              p: 1,
            },
          },
        }}
      >
        <ButtonBase
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
          disableRipple
          onClick={() => onTooltipOpenChange(true)}
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

      {/* backdrop */}
      {tooltipOpen ? (
        <Box
          zIndex={1000}
          onClick={() => onTooltipOpenChange(false)}
          sx={{
            width: '100%',
            height: '100%',
            position: 'fixed',
            top: 0,
            left: 0,
          }}
        />
      ) : null}
    </>
  );
};

export default CandleItem;
