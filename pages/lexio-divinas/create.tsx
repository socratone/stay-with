import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import DailyMissa from 'components/DailyMissa/DailyMissa';
import GlobalHeader from 'components/GlobalHeader';
import { GLOBAL_HEADER_HEIGHT } from 'components/GlobalHeader/constants';
import LexioDivinaForm, {
  LexioDivinaFormValues,
} from 'components/LexioDivinaForm/LexioDivinaForm';
import LoginMessage from 'components/LoginMessage';
import Meta from 'components/Meta';
import { Bible, BIBLE_LABEL } from 'constants/bible';
import { postLexioDivina } from 'helpers/axios';
import useAuth from 'hooks/auth/useAuth';
import useTempLexioDivina from 'hooks/form/useTempLexioDivina';
import useTempLexioDivinaRecorder from 'hooks/form/useTempLexioDivinaRecorder';
import useIsBreakpointsDown from 'hooks/theme/useIsBreakpointsDown';
import useQueryString from 'hooks/url/useQueryString';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useMount } from 'react-use';

const LexioDivinaCreate = () => {
  const router = useRouter();
  const isMediumOrSmaller = useIsBreakpointsDown('md');

  const tempLexioDivina = useTempLexioDivina();

  const { temp } = useQueryString();

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
    enabled: form.formState.isDirty,
  });

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
    if (!user) return;

    setIsRequested(true);

    try {
      const payload = {
        bible: bible.value,
        content: content.trim(),
        phrase: phrase.trim(),
        chapter: Number(chapter),
        verse: Number(verse),
        endChapter: endChapter ? Number(endChapter) : undefined,
        endVerse: endVerse ? Number(endVerse) : undefined,
      };

      await postLexioDivina({
        ...payload,
        userId: user._id,
        likedUserIds: [],
        comments: [],
      });

      resetTempLexioDivina();
      router.push('/');
    } catch (error: any) {
      const status = error?.response?.status;
      if (status === 401) {
        logout();
        router.push('/expired');
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
      <GlobalHeader backButton />

      {!isMediumOrSmaller ? (
        <Box component="main">
          <Container>
            <Box
              display="grid"
              gridTemplateColumns="repeat(2, 1fr)"
              height="100%"
              gap={2}
            >
              {/* left */}
              <Box py={2}>
                <DailyMissa />
              </Box>

              {/* right */}
              <Box display="flex" flexDirection="column" gap={2} py={2}>
                <LexioDivinaForm
                  form={form}
                  isRequested={isRequested}
                  contentRows={15}
                  onCancel={handleCancel}
                  onSubmit={handleSubmit}
                />
              </Box>
            </Box>
          </Container>
        </Box>
      ) : null}

      {isMediumOrSmaller ? (
        <Container>
          <Stack py={2} gap={2}>
            <DailyMissa />
            <LexioDivinaForm
              form={form}
              isRequested={isRequested}
              contentRows={2}
              onCancel={handleCancel}
              onSubmit={handleSubmit}
            />
          </Stack>
        </Container>
      ) : null}
    </>
  );
};

export default LexioDivinaCreate;
