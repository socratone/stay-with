import { Masonry } from '@mui/lab';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { GLOBAL_HEADER_HEIGHT } from 'components/GlobalHeader/constants';
import YoutubeItem from 'components/YoutubeItem';
import YoutubeMusicPlayer from 'components/YoutubeMusicPlayer';
import { PLAYER_SMALL_HEIGHT } from 'components/YoutubeMusicPlayer/constants';
import { PlayerSize, YoutubeVideo } from 'components/YoutubeMusicPlayer/types';
import { motion } from 'framer-motion';
import fs from 'fs';
import useIsBreakpointsDown from 'hooks/theme/useIsBreakpointsDown';
import { GetStaticProps, NextPage } from 'next';
import path from 'path';
import { useEffect, useState } from 'react';
import { popUpContainer, popUpItem } from 'utils/animation';
import { getFileNames } from 'utils/file';

type MusicsProps = {
  items: YoutubeVideo[];
};

const MUSICS_PATH = 'content/musics';
const TRANSITION = 'all .3s ease';
const PLAYER_WIDTH = '400px';

export const getStaticProps: GetStaticProps<MusicsProps> = async () => {
  let items: YoutubeVideo[] = [];
  const fileNames = getFileNames(MUSICS_PATH);
  fileNames.forEach(async (fileName) => {
    const fullPath = path.join(process.cwd(), `${MUSICS_PATH}/${fileName}`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const parsedItems: YoutubeVideo[] = JSON.parse(fileContents);
    parsedItems.forEach((item) => {
      if (!item.videoId) throw new Error('videoId is required.');
      if (!item.title) throw new Error('title is required.');
      if (!item.artist) throw new Error('artist is required.');
      if (!item.thumbnailUrl) throw new Error('thumbnailUrl is required.');
    });
    items = [...items, ...parsedItems];
  });
  return { props: { items } };
};

const Musics: NextPage<MusicsProps> = ({ items }) => {
  const isMediumOrSmaller = useIsBreakpointsDown('md');

  const [video, setVideo] = useState<YoutubeVideo | null>(null);
  const open = !!video;
  const [playList, setPlayList] = useState<YoutubeVideo[]>([]);
  const [playerSize, setPlayerSize] = useState<PlayerSize>();

  const playerTop = (() => {
    switch (playerSize) {
      case 'full':
        return GLOBAL_HEADER_HEIGHT;

      case 'small':
        return `calc(100% - ${PLAYER_SMALL_HEIGHT})`;

      default:
        return '100%';
    }
  })();

  useEffect(() => {
    if (open) {
      setPlayerSize('full');
    }
  }, [open]);

  const handlePlay = (video: YoutubeVideo) => {
    setVideo(video);
    setPlayList((playList) => [...playList, video]);
  };

  const handleSizeChange = (size: PlayerSize) => {
    setPlayerSize(size);
  };

  const handleChange = (video: YoutubeVideo) => {
    setVideo(video);
  };

  const handleListAdd = (video: YoutubeVideo) => {
    setPlayList((playList) => [...playList, video]);
  };

  if (isMediumOrSmaller) {
    return (
      <>
        {open ? (
          <Box
            position="fixed"
            top={playerTop}
            left={0}
            width="100%"
            height={`calc(100% - ${GLOBAL_HEADER_HEIGHT})`}
            zIndex={1}
            bgcolor={(theme) => theme.palette.background.default}
            sx={{
              transition: 'all .5s ease',
              borderTopLeftRadius: (theme) =>
                playerSize === 'full' ? undefined : theme.spacing(3),
              borderTopRightRadius: (theme) =>
                playerSize === 'full' ? undefined : theme.spacing(3),
              boxShadow: (theme) => theme.shadows[1],
              overflow: 'hidden',
            }}
          >
            <YoutubeMusicPlayer
              video={video}
              playList={playList}
              onChange={handleChange}
              size={playerSize}
              onSizeChange={handleSizeChange}
            />
          </Box>
        ) : null}

        <Stack component={motion.div} {...popUpContainer} gap={2} padding={2}>
          {items.map((item) => (
            <Box component={motion.div} {...popUpItem} key={item.videoId}>
              <YoutubeItem
                title={item.title}
                imageUrl={item.thumbnailUrl}
                thumbnailShape={item.thumbnailShape}
                onPlay={() => handlePlay(item)}
                onListAdd={() => handleListAdd(item)}
              />
            </Box>
          ))}
        </Stack>
      </>
    );
  }

  return (
    <Box display="flex">
      <Box
        width={PLAYER_WIDTH}
        sx={{
          transition: TRANSITION,
          transform: open ? undefined : `translateX(-${PLAYER_WIDTH})`,
        }}
      >
        <Box position="sticky" top={GLOBAL_HEADER_HEIGHT}>
          <YoutubeMusicPlayer
            video={video}
            playList={playList}
            onChange={handleChange}
          />
        </Box>
      </Box>

      <Box
        p={2}
        pr={0}
        flexGrow={1}
        sx={{
          ml: open ? undefined : `-${PLAYER_WIDTH}`,
          transition: TRANSITION,
        }}
      >
        <Masonry
          component={motion.div}
          {...popUpContainer}
          spacing={2}
          columns={{ sm: 1, md: 2, lg: 3, xl: 4 }}
        >
          {items.map((item) => (
            <Box component={motion.div} {...popUpItem} key={item.videoId}>
              <YoutubeItem
                title={item.title}
                imageUrl={item.thumbnailUrl}
                thumbnailShape={item.thumbnailShape}
                onPlay={() => handlePlay(item)}
                onListAdd={() => handleListAdd(item)}
              />
            </Box>
          ))}
        </Masonry>
      </Box>
    </Box>
  );
};

export default Musics;
