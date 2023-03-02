import Box from '@mui/material/Box';
import AccessDeniedMessage from 'components/AccessDeniedMessage';
import DailyMissa from 'components/DailyMissa/DailyMissa';
import GlobalHeader from 'components/GlobalHeader';
import { GLOBAL_HEADER_HEIGHT } from 'components/GlobalHeader/GlobalHeader';
import LexioDivinaForm, {
  LexioDivinaFormValues,
} from 'components/LexioDivinaForm/LexioDivinaForm';
import LoadingCircular from 'components/LoadingCircular';
import LoginMessage from 'components/LoginMessage';
import Meta from 'components/Meta';
import { Bible } from 'constants/bible';
import useLexioDivina from 'hooks/api/useLexioDivina';
import useAuth from 'hooks/context/useAuth';
import { putLexioDivina } from 'libs/axios/apis';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { PRIMARY_SHADOW } from 'theme/shadows';

const LexioDivinaEdit = () => {
  const router = useRouter();
  const lexioId = String(router.query.lexioId);
  const { data: lexioDivinaData, isLoading } = useLexioDivina(lexioId);
  const { enqueueSnackbar } = useSnackbar();
  const { user, logout } = useAuth();

  const [isRequested, setIsRequested] = useState(false);

  const form = useForm<LexioDivinaFormValues>({
    defaultValues: {
      bible: Bible.Genesis,
    },
  });

  const setValue = form.setValue;

  useEffect(() => {
    if (lexioDivinaData) {
      const { phrase, bible, chapter, verse, content, endChapter, endVerse } =
        lexioDivinaData;

      setValue('phrase', phrase);
      setValue('bible', bible);
      setValue('chapter', String(chapter));
      setValue('verse', String(verse));
      setValue('content', content);

      if (endChapter && endVerse) {
        setValue('endChapter', String(endChapter));
        setValue('endVerse', String(endVerse));
      }
    }
  }, [lexioDivinaData, setValue]);

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

      await putLexioDivina(lexioId, payload);

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

  if (isLoading || !lexioDivinaData) {
    return (
      <Box p={2}>
        <LoadingCircular />
      </Box>
    );
  }

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

  // 사용자가 작성한 글이 아닌 경우
  if (lexioDivinaData.userId !== user._id) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <AccessDeniedMessage />
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
            <DailyMissa />
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
              defaultIsExpanded={!!lexioDivinaData.endChapter}
              onCancel={handleCancel}
              onSubmit={onSubmit}
            />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default LexioDivinaEdit;
