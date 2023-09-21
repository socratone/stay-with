import Box from '@mui/material/Box';
import YoutubeItem from 'components/YoutubeItem';
import { motion } from 'framer-motion';
import fs from 'fs';
import { GetStaticProps, NextPage } from 'next';
import path from 'path';
import { popUpContainer, popUpItem } from 'utils/animation';
import { getFileNames } from 'utils/file';

type MusicItem = {
  title: string;
  videoId: string;
  thumbnailUrl: string;
};

type MusicsProps = {
  items: MusicItem[];
};

const MUSICS_PATH = 'content/musics';

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
      if (!item.thumbnailUrl) throw new Error('thumbnailUrl is required.');
    });
    items = [...items, ...parsedItems];
  });
  return { props: { items } };
};

const Musics: NextPage<MusicsProps> = ({ items }) => {
  // TODO: thumbnail을 이용해서 꾸미기
  return (
    <Box
      component={motion.div}
      {...popUpContainer}
      display="grid"
      gridTemplateColumns="repeat(auto-fill, minmax(300px, 1fr))"
      gap={2}
      sx={{ padding: 2 }}
    >
      {items.map((item) => (
        <Box component={motion.div} {...popUpItem} key={item.videoId}>
          <YoutubeItem videoId={item.videoId} />
        </Box>
      ))}
    </Box>
  );
};

export default Musics;
