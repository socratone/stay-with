import { keyframes } from '@emotion/react';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ProfileAvatar from 'components/ProfileAvatar/ProfileAvatar';
import Image, { ImageProps } from 'next/image';
import { useState } from 'react';
import { FormattedDate } from 'react-intl';
import { generateRandomNumber } from 'utils/number';

type CandleItemProps = {
  imageSrc: ImageProps['src'];
  row: number;
  column: number;
  rowOffset?: number;
  message: string;
  name?: string;
  profileImageUrl?: string;
  createdAt: Date;
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
  profileImageUrl,
  createdAt,
  isMyself,
  onEdit,
  onDelete,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
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
        onClick={handleClick}
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

      <Menu
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        MenuListProps={{
          sx: {
            '&.MuiMenu-list': {
              padding: 1,
            },
          },
        }}
      >
        <Stack gap={0.5}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <ProfileAvatar src={profileImageUrl} size="2.125rem" />
            <Stack flexGrow={1}>
              <Typography
                variant="body2"
                color={(theme) => theme.palette.text.primary}
                fontWeight={500}
                sx={{ lineHeight: 1.2 }}
              >
                {name}
              </Typography>
              <Typography
                variant="body2"
                color={(theme) => theme.palette.text.secondary}
                sx={{ lineHeight: 1.2 }}
              >
                <FormattedDate value={createdAt} />
              </Typography>
            </Stack>
            <Box alignSelf="flex-start">
              <IconButton size="small" onClick={handleClose}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          </Stack>
          <Typography
            color={(theme) => theme.palette.text.secondary}
            whiteSpace="pre-line"
            sx={{
              wordBreak: 'break-all',
            }}
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
      </Menu>
    </>
  );
};

export default CandleItem;
