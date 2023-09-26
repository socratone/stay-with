import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { YouTubePlayer } from 'react-youtube';
import { parseSecondsToMMSS } from 'utils/date';

import { YoutubeVideo } from './types';
import useCurrentPlayTime from './useCurrentPlayTime';

type PlayListProps = {
  items: YoutubeVideo[];
  video: YoutubeVideo | null;
  onChange: (video: YoutubeVideo) => void;
  player: YouTubePlayer;
};

// TODO: scroll
const PlayList: React.FC<PlayListProps> = ({
  items,
  video,
  onChange,
  player,
}) => {
  const { currentPlayTime } = useCurrentPlayTime(player);

  return (
    <Stack pl="6%" pr="3%">
      {/* TODO: key 수정 */}
      {items.map((item, index) => {
        const order = index + 1;

        return (
          <Stack
            key={index}
            direction="row"
            gap={1}
            py={1.5}
            onClick={() => onChange(item)}
            position="relative"
            sx={{
              cursor: 'pointer',
            }}
          >
            {item.videoId === video?.videoId ? (
              <Box
                height="100%"
                width={(currentPlayTime * 100) / item.duration + '%'}
                position="absolute"
                top={0}
                left={0}
                sx={{
                  transition: 'width 1s linear',
                  zIndex: -1,
                  borderRadius: 3,
                  background: (theme) =>
                    `linear-gradient(90deg, ${
                      theme.palette.mode === 'light' ? '#fff' : '#000'
                    } 0%, ${
                      theme.palette.mode === 'light' ? '#edeeef' : '#3d3d3d'
                    } 100%)`,
                }}
              />
            ) : null}
            <Box display="flex" alignItems="center" width={32}>
              <Typography color="text.primary" fontWeight={500}>
                {order < 10 ? '0' + order : order}
              </Typography>
            </Box>
            <Stack>
              <Typography color="text.primary" fontWeight={500}>
                {item.title}
              </Typography>
              <Typography color="text.secondary" variant="body2">
                {item.artist}
                {' • '}
                {parseSecondsToMMSS(item.duration)}
              </Typography>
            </Stack>
          </Stack>
        );
      })}
    </Stack>
  );
};

export default PlayList;
