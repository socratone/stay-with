import { LinearProgress } from '@mui/material';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { YouTubePlayer } from 'react-youtube';
import { parseSecondsToMMSS } from 'utils/date';

import useCurrentPlayTime from './useCurrentPlayTime';

type TimeProgressProps = {
  player: YouTubePlayer | null;
  duration: number;
};

const TimeProgress: React.FC<TimeProgressProps> = ({ player, duration }) => {
  const { currentPlayTime } = useCurrentPlayTime(player);

  const handleProgressClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const div = event.target as HTMLDivElement;
    const clickedX = event.clientX - div.getBoundingClientRect().left;
    const clickedPercent = (clickedX * 100) / div.clientWidth;
    player.seekTo((clickedPercent * duration) / 100);
  };

  return (
    <Box>
      <Box position="relative" mx="6%" py={2}>
        {/* clicker */}
        <Box
          position="absolute"
          width="100%"
          height="100%"
          top={0}
          left={0}
          zIndex={1}
          sx={{ cursor: 'pointer' }}
          onClick={handleProgressClick}
        />
        <LinearProgress
          variant="determinate"
          value={(currentPlayTime * 100) / duration}
        />
      </Box>

      <Stack
        direction="row"
        justifyContent="space-between"
        px="6%"
        mb={1}
        gap={2}
      >
        <Typography color="text.secondary" variant="caption">
          {parseSecondsToMMSS(Math.floor(currentPlayTime))}
        </Typography>
        <Typography color="text.secondary" variant="caption">
          {parseSecondsToMMSS(duration)}
        </Typography>
      </Stack>
    </Box>
  );
};

export default TimeProgress;
