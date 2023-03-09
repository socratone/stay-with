import 'react-spring-bottom-sheet/dist/style.css';

import { useMediaQuery, useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import GlobalHeader from 'components/GlobalHeader';
import { GLOBAL_HEADER_HEIGHT } from 'components/GlobalHeader/GlobalHeader';
import LexioDivinaForm, {
  LexioDivinaFormValues,
} from 'components/LexioDivinaForm/LexioDivinaForm';
import LoginMessage from 'components/LoginMessage';
import Meta from 'components/Meta';
import { Bible } from 'constants/bible';
import useAuth from 'hooks/context/useAuth';
import useColorMode from 'hooks/context/useColorMode';
import { postLexioDivina } from 'libs/axios/apis';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { BottomSheet } from 'react-spring-bottom-sheet';

const LexioDivinaCreate = () => {
  const router = useRouter();
  const theme = useTheme();
  const isTabletOrSmaller = useMediaQuery(theme.breakpoints.down('md'));

  const { enqueueSnackbar } = useSnackbar();
  const { user, logout } = useAuth();
  const { colorMode } = useColorMode();

  useEffect(() => {
    const root = document.querySelector(':root') as any;

    if (colorMode === 'dark') {
      root.style.setProperty('--rsbs-bg', 'black');
      root.style.setProperty('--rsbs-handle-bg', 'white');
    } else {
      root.style.setProperty('--rsbs-bg', '');
      root.style.setProperty('--rsbs-handle-bg', '');
    }
  }, [colorMode]);

  const [isRequested, setIsRequested] = useState(false);

  const form = useForm<LexioDivinaFormValues>({
    defaultValues: {
      bible: Bible.Genesis,
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
        bible,
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

      <Box
        component="main"
        sx={{
          height: `calc(100vh - ${GLOBAL_HEADER_HEIGHT}px)`,
        }}
      >
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
            <Box
              component="iframe"
              src="https://missa.cbck.or.kr/DailyMissa"
              sx={{
                border: 0,
                width: '100%',
                height: '100%',
                display: 'block',
              }}
            />
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
        <BottomSheet
          open
          defaultSnap={300}
          snapPoints={({ maxHeight }) => [
            (maxHeight / 10) * 9,
            (maxHeight / 10) * 8,
            (maxHeight / 10) * 7,
            (maxHeight / 10) * 6,
            (maxHeight / 10) * 5,
            (maxHeight / 10) * 4,
            (maxHeight / 10) * 3,
            300,
            110,
          ]}
          expandOnContentDrag
          blocking={false}
        >
          <LexioDivinaForm
            form={form}
            isRequested={isRequested}
            contentRows={2}
            onCancel={handleCancel}
            onSubmit={onSubmit}
          />
        </BottomSheet>
      ) : null}
    </>
  );
};

export default LexioDivinaCreate;
