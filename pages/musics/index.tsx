import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { GLOBAL_HEADER_HEIGHT } from 'components/GlobalHeader/constants';
import YoutubeItem from 'components/YoutubeItem';
import YoutubeMusicPlayer from 'components/YoutubeMusicPlayer';
import { MusicItem } from 'components/YoutubeMusicPlayer/types';
import { motion } from 'framer-motion';
import fs from 'fs';
import useIsBreakpointsDown from 'hooks/theme/useIsBreakpointsDown';
import { GetStaticProps, NextPage } from 'next';
import path from 'path';
import { useState } from 'react';
import { popUpContainer, popUpItem } from 'utils/animation';
import { getFileNames } from 'utils/file';

type MusicsProps = {
  items: MusicItem[];
};

const MUSICS_PATH = 'content/musics';
const TRANSITION = 'all .3s ease';
const PLAYER_WIDTH = '400px';

export const getStaticProps: GetStaticProps<MusicsProps> = async () => {
  let items: MusicItem[] = [];
  const fileNames = getFileNames(MUSICS_PATH);
  fileNames.forEach(async (fileName) => {
    const fullPath = path.join(process.cwd(), `${MUSICS_PATH}/${fileName}`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const parsedItems: MusicItem[] = JSON.parse(fileContents);
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

  const [selectedItem, setSelectedItem] = useState<MusicItem | null>(null);
  const open = !!selectedItem;

  const handleClick = (item: MusicItem) => {
    setSelectedItem(item);
  };

  const handleMusicPlayerClose = () => {
    setSelectedItem(null);
  };

  if (isMediumOrSmaller) {
    return (
      <Box>
        {open ? (
          <YoutubeMusicPlayer
            selectedItem={selectedItem}
            onClose={handleMusicPlayerClose}
          />
        ) : (
          <Stack component={motion.div} {...popUpContainer} gap={2} padding={2}>
            {items.map((item) => (
              <Box component={motion.div} {...popUpItem} key={item.videoId}>
                <YoutubeItem
                  title={item.title}
                  imageUrl={item.thumbnailUrl}
                  onClick={() => handleClick(item)}
                />
              </Box>
            ))}
          </Stack>
        )}
      </Box>
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
            selectedItem={selectedItem}
            onClose={handleMusicPlayerClose}
          />
        </Box>
      </Box>

      <Box
        flexGrow={1}
        component={motion.div}
        {...popUpContainer}
        display="grid"
        gridTemplateColumns="repeat(auto-fill, minmax(300px, 1fr))"
        gap={2}
        p={2}
        sx={{
          ml: open ? undefined : `-${PLAYER_WIDTH}`,
          transition: TRANSITION,
        }}
      >
        {items.map((item) => (
          <Box component={motion.div} {...popUpItem} key={item.videoId}>
            <YoutubeItem
              title={item.title}
              imageUrl={item.thumbnailUrl}
              onClick={() => handleClick(item)}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Musics;
