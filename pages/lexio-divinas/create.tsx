import { useMediaQuery, useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import DailyMissa from 'components/DailyMissa/DailyMissa';
import GlobalHeader from 'components/GlobalHeader';
import { GLOBAL_HEADER_HEIGHT } from 'components/GlobalHeader/GlobalHeader';
import LexioDivinaBottomSheet from 'components/LexioDivinaBottomSheet/LexioDivinaBottomSheet';
import LexioDivinaForm, {
  LexioDivinaFormValues,
} from 'components/LexioDivinaForm/LexioDivinaForm';
import LoginMessage from 'components/LoginMessage';
import Meta from 'components/Meta';
import { Bible, BIBLE_LABEL } from 'constants/bible';
import { postLexioDivina } from 'helpers/axios';
import useAuth from 'hooks/context/useAuth';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

const LexioDivinaCreate = () => {
  const router = useRouter();
  const theme = useTheme();
  const isTabletOrSmaller = useMediaQuery(theme.breakpoints.down('md'));

  const { enqueueSnackbar } = useSnackbar();
  const { user, logout } = useAuth();

  const [isRequested, setIsRequested] = useState(false);

  const form = useForm<LexioDivinaFormValues>({
    defaultValues: {
      bible: { value: Bible.Genesis, label: BIBLE_LABEL[Bible.Genesis] },
    },
  });

  const handleCancel = () => {
    router.back();
  };

  const onSubmit: SubmitHandler<LexioDivinaFormValues> = async ({
    bible,
    content,
    phrase,
    chapter,
    verse,
    endChapter,
    endVerse,
  }) => {
    if (!user) return;

    setIsRequested(true);

    try {
      const payload = {
        bible: bible.value,
        content,
        phrase,
        chapter: Number(chapter),
        verse: Number(verse),
        endChapter: endChapter ? Number(endChapter) : 0,
        endVerse: endVerse ? Number(endVerse) : 0,
      };

      await postLexioDivina({
        ...payload,
        userId: user._id,
        likedUserIds: [],
        comments: [],
      });

      router.push('/');
    } catch (error: any) {
      const status = error?.response?.status;
      if (status === 401) {
        logout();
        router.push('/expired');
      } else {
        enqueueSnackbar('에러가 발생했습니다.', {
          variant: 'error',
        });
      }
    } finally {
      setIsRequested(false);
    }
  };

  // 로그인을 하지 않았을 경우
  if (!user) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <LoginMessage />
      </Box>
    );
  }

  return (
    <>
      <Meta />
      <GlobalHeader />

      <Box component="main" height={`calc(100vh - ${GLOBAL_HEADER_HEIGHT}px)`}>
        <Box
          display="grid"
          gridTemplateColumns={{
            xs: '1fr',
            sm: '1fr',
            md: '1fr 1fr',
          }}
          height="100%"
        >
          {/* left */}
          <Box>
            <DailyMissa />
          </Box>

          {/* right */}
          {!isTabletOrSmaller ? (
            <Box
              display="flex"
              flexDirection="column"
              gap={2}
              sx={{
                height: '100%',
                overflowY: 'auto',
              }}
            >
              <LexioDivinaForm
                form={form}
                isRequested={isRequested}
                contentRows={15}
                onCancel={handleCancel}
                onSubmit={onSubmit}
              />
            </Box>
          ) : null}
        </Box>
      </Box>

      {isTabletOrSmaller ? (
        <LexioDivinaBottomSheet>
          <LexioDivinaForm
            form={form}
            isRequested={isRequested}
            contentRows={2}
            onCancel={handleCancel}
            onSubmit={onSubmit}
          />
        </LexioDivinaBottomSheet>
      ) : null}
    </>
  );
};

export default LexioDivinaCreate;
