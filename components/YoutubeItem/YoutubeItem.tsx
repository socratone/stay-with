import Box from '@mui/material/Box';
import Image from 'next/image';

type YoutubeItemProps = {
  title: string;
  imageUrl: string;
  onClick: () => void;
};

const YoutubeItem: React.FC<YoutubeItemProps> = ({
  title,
  imageUrl,
  onClick,
}) => {
  return (
    <Box
      onClick={onClick}
      sx={{
        aspectRatio: '640 / 360',
        overflow: 'hidden',
        borderRadius: 6,
        position: 'relative',
        cursor: 'pointer',
      }}
    >
      <Image src={imageUrl} alt={title} fill />
    </Box>
  );
};

export default YoutubeItem;
