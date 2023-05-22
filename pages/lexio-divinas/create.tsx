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
import useAuth from 'hooks/auth/useAuth';
import useTempLexioDivina from 'hooks/form/useTempLexioDivina';
import useTempLexioDivinaRecorder from 'hooks/form/useTempLexioDivinaRecorder';
import useIsBreakpointsDown from 'hooks/theme/useIsBreakpointsDown';
import useQueryString from 'hooks/url/useQueryString';
import { useRouter } from 'next/router';
import { enqueueSnackbar } from 'notistack';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useIntl } from 'react-intl';
import { useMount } from 'react-use';

const LexioDivinaCreate = () => {
  const { formatMessage } = useIntl();
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
          {!isMediumOrSmaller ? (
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

      {isMediumOrSmaller ? (
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
