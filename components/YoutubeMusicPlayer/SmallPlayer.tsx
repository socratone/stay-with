import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { alpha } from '@mui/material';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Image from 'next/image';

import { PLAYER_SMALL_HEIGHT } from './constants';
import PauseIcon from './PauseIcon';
import PlayIcon from './PlayIcon';
import { PlayerSize, YoutubeVideo } from './types';

type SmallPlayerProps = {
  video: YoutubeVideo | null;
  onSizeChange?: (size: PlayerSize) => void;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
};

const SmallPlayer: React.FC<SmallPlayerProps> = ({
  video,
  onSizeChange,
  isPlaying,
  onPause,
  onPlay,
}) => {
  const isSquare = video?.thumbnailShape === 'square';

  const handleFullSize = () => {
    onSizeChange && onSizeChange('full');
  };

  return (
    <Box
      position="absolute"
      top={0}
      left={0}
      width="100%"
      height={PLAYER_SMALL_HEIGHT}
      sx={{
        position: 'relative',
        zIndex: 1,
      }}
    >
      {video ? (
        <Box
          position="relative"
          height="100%"
          onClick={handleFullSize}
          sx={{
            aspectRatio: isSquare ? '1 / 1' : '1920 / 1080',
            cursor: 'pointer',
          }}
        >
          <Image
            src={video.thumbnailUrl}
            alt={video.title}
            fill
            style={{ objectFit: 'cover' }}
          />
        </Box>
      ) : null}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        position="absolute"
        top={0}
        left="4rem"
        width="calc(100% - 4rem)"
        height="100%"
        bgcolor={(theme) => theme.palette.background.default}
        sx={{
          '&::before': {
            content: '""',
            position: 'absolute',
            right: '100%',
            width: '3rem',
            height: '100%',
            background: (theme) =>
              `linear-gradient(90deg, ${alpha(
                theme.palette.mode === 'light' ? '#fff' : '#000',
                0
              )} 0%, ${theme.palette.mode === 'light' ? '#fff' : '#000'} 100%)`,
            pointerEvents: 'none',
          },
        }}
      >
        <Stack
          pl={1}
          onClick={handleFullSize}
          height="100%"
          justifyContent="center"
          sx={{ cursor: 'pointer' }}
        >
          <Typography color="text.primary" variant="body2" fontWeight={500}>
            {video?.title}
          </Typography>
          <Typography color="text.secondary" variant="caption">
            {video?.artist}
          </Typography>
        </Stack>
        <Stack direction="row" gap={1.5} pr={2}>
          <IconButton disabled>
            <FavoriteBorderIcon />
          </IconButton>
          {isPlaying ? (
            <IconButton
              onClick={onPause}
              sx={{
                color: (theme) => theme.palette.common.white,
                bgcolor: (theme) => theme.palette.primary.main,
                width: 40,
                height: 40,
                borderRadius: 3,
              }}
              size="small"
            >
              <PauseIcon />
            </IconButton>
          ) : (
            <IconButton
              onClick={onPlay}
              sx={{
                color: (theme) => theme.palette.common.white,
                bgcolor: (theme) => theme.palette.primary.main,
                width: 40,
                height: 40,
                borderRadius: 3,
              }}
              size="small"
            >
              <PlayIcon />
            </IconButton>
          )}
        </Stack>
      </Stack>
    </Box>
  );
};

export default SmallPlayer;
