import Box from '@mui/material/Box';

type YoutubeItemProps = {
  videoId: string;
};

const YoutubeItem: React.FC<YoutubeItemProps> = ({ videoId }) => {
  return (
    <Box
      sx={{
        aspectRatio: '640 / 360',
        overflow: 'hidden',
        borderRadius: 6,
        iframe: {
          width: '100%',
          height: '100%',
          display: 'block',
          border: 0,
        },
      }}
    >
      <iframe src={`https://www.youtube.com/embed/${videoId}`} />
    </Box>
  );
};

export default YoutubeItem;
