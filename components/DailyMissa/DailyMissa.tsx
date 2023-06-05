import Stack from '@mui/material/Stack';
import { BIBLE_INTRO } from 'constants/bible';
import useMissa from 'hooks/api/useMissa';

import Word from './Word';

const DailyMissa = () => {
  const { data: missaData } = useMissa();

  const parseToBible = (bibleInfo: string | null) => {
    if (!bibleInfo) return null;
    for (const key in BIBLE_INTRO) {
      const label = BIBLE_INTRO[key];
      if (bibleInfo.includes(label)) {
        return key;
      }
    }
    return null;
  };

  return (
    <Stack spacing={2} p={2} pb={12}>
      {missaData?.words.map((word) => (
        <Word
          key={word.bibleInfo}
          bible={parseToBible(word.bibleInfo)}
          title={word.title}
          bibleInfo={word.bibleInfo ?? ''}
          contents={word.contents}
        />
      ))}
    </Stack>
  );
};

export default DailyMissa;
