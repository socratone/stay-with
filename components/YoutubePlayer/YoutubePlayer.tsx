import { Box, useTheme } from '@mui/material';

interface YoutubePlayerProps {
  videoId: string;
}

const YoutubePlayer: React.FC<YoutubePlayerProps> = ({ videoId }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        aspectRatio: '1920 / 1080',
        height: 120,
        position: 'fixed',
        left: theme.spacing(2),
        bottom: theme.spacing(2),
        borderRadius: 3,
        overflow: 'hidden',
      }}
    >
      <iframe
        width="100%"
        height="100%"
        id="ytplayer"
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
        frameBorder="0"
      />
    </Box>
  );
};

export default YoutubePlayer;
