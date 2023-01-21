import { Box } from '@mui/material';

interface YoutubeVideoProps {
  videoId: string;
}

/**
 * deprecated
 */
const YoutubeVideo: React.FC<YoutubeVideoProps> = ({ videoId }) => {
  return (
    <Box
      sx={{
        aspectRatio: '1920 / 1080',
        borderRadius: 3,
        overflow: 'hidden',
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
  );
};

export default YoutubeVideo;
