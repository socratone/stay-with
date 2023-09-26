import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import { IconButton, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Image from 'next/image';

type YoutubeItemProps = {
  title: string;
  thumbnailShape?: 'square';
  imageUrl: string;
  onPlay: () => void;
  onListAdd: () => void;
};

const YoutubeItem: React.FC<YoutubeItemProps> = ({
  title,
  thumbnailShape,
  imageUrl,
  onPlay,
  onListAdd,
}) => {
  return (
    <Stack gap={1}>
      <Box
        onClick={onPlay}
        sx={{
          cursor: 'pointer',
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
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography
          color="text.primary"
          fontWeight={500}
          variant="h6"
          textOverflow="ellipsis"
          overflow="hidden"
          noWrap
        >
          {title}
        </Typography>
        <IconButton onClick={onListAdd} sx={{ my: -1 }}>
          <PlaylistAddIcon />
        </IconButton>
      </Stack>
    </Stack>
  );
};

export default YoutubeItem;
