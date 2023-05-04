import { useMediaQuery, useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import AccessDeniedMessage from 'components/AccessDeniedMessage';
import DailyMissa from 'components/DailyMissa/DailyMissa';
import ErrorMessage from 'components/ErrorMessage/ErrorMessage';
import GlobalHeader from 'components/GlobalHeader';
import { GLOBAL_HEADER_HEIGHT } from 'components/GlobalHeader/GlobalHeader';
import LexioDivinaBottomSheet from 'components/LexioDivinaBottomSheet/LexioDivinaBottomSheet';
import LexioDivinaForm, {
  LexioDivinaFormValues,
} from 'components/LexioDivinaForm/LexioDivinaForm';
import LoadingCircular from 'components/LoadingCircular';
import LoginMessage from 'components/LoginMessage';
import Meta from 'components/Meta';
import { Bible, BIBLE_LABEL } from 'constants/bible';
import { putLexioDivina } from 'helpers/axios';
import useLexioDivina from 'hooks/api/useLexioDivina';
import useAuth from 'hooks/auth/useAuth';
import useTempLexioDivinaRecorder from 'hooks/form/useTempLexioDivinaRecorder';
import useQueryString from 'hooks/router/useQueryString';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useIntl } from 'react-intl';
import { useAppSelector } from 'redux/hooks';

const LexioDivinaEdit = () => {
  const { formatMessage } = useIntl();
  const router = useRouter();
  const theme = useTheme();
  const isTabletOrSmaller = useMediaQuery(theme.breakpoints.down('md'));
  const tempLexioDivina = useAppSelector((state) => state.tempLexioDivina);

  const { temp } = useQueryString();

  const lexioId =
    typeof router.query.lexioId === 'string' ? router.query.lexioId : undefined;

  const { data: lexioDivinaData, isLoading, isError } = useLexioDivina(lexioId);
  const { enqueueSnackbar } = useSnackbar();
  const { user, logout } = useAuth();

  const [isRequested, setIsRequested] = useState(false);

  const form = useForm<LexioDivinaFormValues>({
    defaultValues: {
      bible: { value: Bible.Genesis, label: BIBLE_LABEL[Bible.Genesis] },
    },
  });

  const setValue = form.setValue;

  const { reset: resetTempLexioDivina } = useTempLexioDivinaRecorder({
    value: form.watch(),
    id: lexioId,
    enabled: form.formState.isDirty,
  });

  useEffect(() => {
    if (lexioDivinaData && !temp) {
      const { phrase, bible, chapter, verse, content, endChapter, endVerse } =
        lexioDivinaData;

      setValue('phrase', phrase);
      setValue('bible', { value: bible, label: BIBLE_LABEL[bible] });
      setValue('chapter', String(chapter));
      setValue('verse', String(verse));
      setValue('content', content);

      if (endChapter && endVerse) {
        setValue('endChapter', String(endChapter));
        setValue('endVerse', String(endVerse));
      }
    }
  }, [lexioDivinaData, temp, setValue]);

  useEffect(() => {
    if (temp) {
      const { phrase, bible, chapter, verse, content, endChapter, endVerse } =
        tempLexioDivina;

      phrase && setValue('phrase', phrase);
      bible && setValue('bible', bible);
      chapter && setValue('chapter', chapter);
      verse && setValue('verse', verse);
      content && setValue('content', content);
      setValue('endChapter', endChapter);
      setValue('endVerse', endVerse);
    }
  }, [temp, tempLexioDivina, setValue]);

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
    if (!user || !lexioId) return;

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

      await putLexioDivina(lexioId, payload);

      resetTempLexioDivina();
      router.push('/');
    } catch (error: any) {
      const status = error?.response?.status;
      if (status === 401) {
        logout();
        router.push('/expired');
      } else {
        enqueueSnackbar(formatMessage({ id: 'error.message.common' }), {
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

  if (isError) {
    return (
      <Box p={2}>
        <ErrorMessage />
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
                defaultIsExpanded={!!lexioDivinaData.endChapter}
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
            defaultIsExpanded={!!lexioDivinaData.endChapter}
            contentRows={2}
            onCancel={handleCancel}
            onSubmit={onSubmit}
          />
        </LexioDivinaBottomSheet>
      ) : null}
    </>
  );
};

export default LexioDivinaEdit;
