import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Image from 'next/image';

type YoutubeItemProps = {
  title: string;
  thumbnailShape?: 'square';
  imageUrl: string;
  onClick: () => void;
};

const YoutubeItem: React.FC<YoutubeItemProps> = ({
  title,
  thumbnailShape,
  imageUrl,
  onClick,
}) => {
  return (
    <Stack
      gap={1}
      onClick={onClick}
      sx={{
        cursor: 'pointer',
      }}
    >
      <Box
        sx={{
          aspectRatio: thumbnailShape === 'square' ? '1 / 1' : '640 / 360',
          overflow: 'hidden',
          borderRadius: 6,
          position: 'relative',
          boxShadow: (theme) => theme.shadows[1],
        }}
      >
        <Image
          src={imageUrl}
          alt={title}
          fill
          style={{
            objectFit: thumbnailShape === 'square' ? 'cover' : undefined,
          }}
        />
      </Box>
      <Typography
        color="text.primary"
        fontWeight={500}
        variant="h6"
        textAlign="center"
      >
        {title}
      </Typography>
    </Stack>
  );
};

export default YoutubeItem;
