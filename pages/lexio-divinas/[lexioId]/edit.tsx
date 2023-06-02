import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import AccessDeniedMessage from 'components/AccessDeniedMessage';
import ErrorMessage from 'components/ErrorMessage/ErrorMessage';
import GlobalHeader from 'components/GlobalHeader';
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
import useTempLexioDivina from 'hooks/form/useTempLexioDivina';
import useTempLexioDivinaRecorder from 'hooks/form/useTempLexioDivinaRecorder';
import useQueryString from 'hooks/url/useQueryString';
import { useRouter } from 'next/router';
import { enqueueSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useIntl } from 'react-intl';
import { useMount } from 'react-use';

const LexioDivinaEdit = () => {
  const { formatMessage } = useIntl();
  const router = useRouter();
  const tempLexioDivina = useTempLexioDivina();

  const { temp } = useQueryString();

  const lexioId =
    typeof router.query.lexioId === 'string' ? router.query.lexioId : undefined;

  const { data: lexioDivinaData, isLoading, isError } = useLexioDivina(lexioId);
  const { user, logout } = useAuth();

  const [isRequested, setIsRequested] = useState(false);

  const form = useForm<LexioDivinaFormValues>({
    defaultValues: {
      bible: { value: Bible.Genesis, label: BIBLE_LABEL[Bible.Genesis] },
    },
  });

  const { reset } = form;

  const { reset: resetTempLexioDivina } = useTempLexioDivinaRecorder({
    value: form.watch(),
    id: lexioId,
    enabled: form.formState.isDirty,
  });

  // 서버에 저장된 값을 불러와 form에 입력한다.
  useEffect(() => {
    if (lexioDivinaData && !temp) {
      const { phrase, bible, chapter, verse, content, endChapter, endVerse } =
        lexioDivinaData.lexioDivina;

      let values: LexioDivinaFormValues = {
        phrase,
        bible: { value: bible, label: BIBLE_LABEL[bible] },
        chapter: String(chapter),
        verse: String(verse),
        content,
      };

      if (endChapter && endVerse) {
        values = {
          ...values,
          endChapter: String(endChapter),
          endVerse: String(endVerse),
        };
      }

      reset(values);
    }
  }, [lexioDivinaData, temp, reset]);

  // ?temp=true인 경우 임시 저장된 값을 form에 입력한다.
  useMount(() => {
    if (temp) {
      reset(tempLexioDivina);
    }
  });

  const handleCancel = () => {
    router.back();
  };

  const handleSubmit: SubmitHandler<LexioDivinaFormValues> = async ({
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
        endChapter: endChapter ? Number(endChapter) : undefined,
        endVerse: endVerse ? Number(endVerse) : undefined,
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
  if (lexioDivinaData.lexioDivina.userId !== user._id) {
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

      <Container maxWidth="sm">
        <LexioDivinaForm
          form={form}
          isRequested={isRequested}
          defaultIsExpanded={!!lexioDivinaData.lexioDivina.endChapter}
          contentRows={15}
          onCancel={handleCancel}
          onSubmit={handleSubmit}
        />
      </Container>
    </>
  );
};

export default LexioDivinaEdit;
