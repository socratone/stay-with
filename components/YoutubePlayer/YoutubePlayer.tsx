import { Box, IconButton, useTheme } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useState } from 'react';

interface YoutubePlayerProps {
  videoId: string;
}

const VIDEO_HEIGHT = 120;

const YoutubePlayer: React.FC<YoutubePlayerProps> = ({ videoId }) => {
  const theme = useTheme();
  const [hidden, setHidden] = useState(false);

  const handleClick = () => {
    setHidden((hidden) => !hidden);
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        left: theme.spacing(2),
        bottom: theme.spacing(2),
        transform: `translateY(${hidden ? `${VIDEO_HEIGHT}px` : 0})`,
        transition: 'all 0.3s ease',
      }}
    >
      <IconButton
        size="small"
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          transform: 'translateY(-100%)',
        }}
        onClick={handleClick}
      >
        {hidden ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
      </IconButton>
      <Box
        sx={{
          aspectRatio: '1920 / 1080',
          height: VIDEO_HEIGHT,
          borderRadius: 3,
          overflow: 'hidden',
          opacity: hidden ? 0 : 1,
          transition: 'all 0.3s ease',
        }}
      >
        <iframe
          width="100%"
          height="100%"
          id="ytplayer"
          src={`https://www.youtube.com/embed/${videoId}?color=white&fs=0`}
          frameBorder="0"
        />
      </Box>
    </Box>
  );
};

export default YoutubePlayer;
