import { LinearProgress } from '@mui/material';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { YouTubePlayer } from 'react-youtube';

type TimeProgressProps = {
  player: YouTubePlayer | null;
  duration: number;
};

const TimeProgress: React.FC<TimeProgressProps> = ({ player, duration }) => {
  const [currentPlayTime, setCurrentPlayTime] = useState(0);

  useEffect(() => {
    // Use a setInterval to periodically update the current play time
    const interval = setInterval(() => {
      if (player) {
        const currentTime = player.getCurrentTime();
        setCurrentPlayTime(currentTime);
      }
    }, 1000); // Update every 1 second

    // Clean up the interval when the component unmounts
    return () => clearInterval(interval);
  }, [player]);

  const parseSecondsToMMSS = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const secondsString = String(remainingSeconds).padStart(2, '0');
    return `${minutes}:${secondsString}`;
  };

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
