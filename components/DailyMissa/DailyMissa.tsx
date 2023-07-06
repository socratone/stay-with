import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ErrorMessage from 'components/ErrorMessage/ErrorMessage';
import { BIBLE_INTRO } from 'constants/bible';
import useMissa from 'hooks/api/useMissa';
import { useState } from 'react';

import Loading from './Loading';
import StartingPrayerDialog from './StartingPrayerDialog';
import Word from './Word';

const DailyMissa = () => {
  const [startingPrayerOpened, setStartingPrayerOpened] = useState(false);
  const [offset, setOffset] = useState(0);

  const {
    data: missaData,
    isLoading,
    isError,
  } = useMissa(offset ? { offset } : undefined);

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

  const openStartingPrayer = () => {
    setStartingPrayerOpened(true);
  };

  const closeStartingPrayer = () => {
    setStartingPrayerOpened(false);
  };

  const handlePrevious = () => {
    setOffset((offset) => offset - 1);
  };

  const handleNext = () => {
    setOffset((offset) => offset + 1);
  };

  return (
    <>
      <Stack spacing={2}>
        {isError ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="50vh"
          >
            <ErrorMessage />
          </Box>
        ) : isLoading ? (
          <Loading />
        ) : (
          <>
            <Stack direction="row" justifyContent="space-between" spacing={1}>
              <Stack
                direction="row"
                alignItems="center"
                gap={1}
                flexWrap="wrap"
              >
                <Button
                  variant="outlined"
                  color="secondary"
                  size="small"
                  onClick={openStartingPrayer}
                >
                  시작 기도
                </Button>
                <Typography color="text.primary">{missaData.today}</Typography>
              </Stack>
              <Stack direction="row" alignItems="center">
                <IconButton
                  size="small"
                  onClick={handlePrevious}
                  disabled={offset === -1}
                  sx={{ marginY: -1 }}
                >
                  <KeyboardArrowLeftIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={handleNext}
                  disabled={offset === 1}
                  sx={{ marginY: -1 }}
                >
                  <KeyboardArrowRightIcon />
                </IconButton>
              </Stack>
            </Stack>

            {missaData.words.map((word, index) => (
              <Word
                key={index}
                bible={parseToBible(word.bibleInfo)}
                title={word.title}
                bibleInfo={word.bibleInfo ?? ''}
                contents={word.contents}
              />
            ))}
          </>
        )}
      </Stack>

      {startingPrayerOpened ? (
        <StartingPrayerDialog
          open={startingPrayerOpened}
          onClose={closeStartingPrayer}
        />
      ) : null}
    </>
  );
};

export default DailyMissa;
