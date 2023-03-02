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
import { postLexioDivina } from 'libs/axios/apis';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { PRIMARY_SHADOW } from 'theme/shadows';

const LexioDivinaCreate = () => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { user, logout } = useAuth();

  const form = useForm<LexioDivinaFormValues>({
    defaultValues: {
      bible: Bible.Genesis,
    },
  });

  const [isRequested, setIsRequested] = useState(false);

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
          height: {
            xs: 'unset',
            sm: 'unset',
            md: `calc(100vh - ${GLOBAL_HEADER_HEIGHT}px)`,
          },
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
                height: { xs: '50vh', sm: '50vh', md: '100%' },
                display: 'block',
              }}
            />
          </Box>

          {/* right */}
          <Box
            display="flex"
            flexDirection="column"
            gap={2}
            sx={{
              height: '100%',
              overflowY: 'auto',
              boxShadow: {
                xs: PRIMARY_SHADOW,
                sm: PRIMARY_SHADOW,
                md: 'unset',
              },
            }}
          >
            <LexioDivinaForm
              form={form}
              isRequested={isRequested}
              onCancel={handleCancel}
              onSubmit={onSubmit}
            />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default LexioDivinaCreate;
