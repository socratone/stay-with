import Box from '@mui/material/Box';
import AccessDeniedMessage from 'components/AccessDeniedMessage';
import DailyMissa from 'components/DailyMissa/DailyMissa';
import GlobalHeader from 'components/GlobalHeader';
import { GLOBAL_HEADER_HEIGHT } from 'components/GlobalHeader/GlobalHeader';
import LexioDivinaForm from 'components/LexioDivinaForm/LexioDivinaForm';
import LoginMessage from 'components/LoginMessage';
import Meta from 'components/Meta';
import { Bible } from 'constants/bible';
import useAuth from 'hooks/context/useAuth';
import { postLexioDivina, putLexioDivina } from 'libs/axios/apis';
import { ObjectId } from 'mongodb';
import type { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import Database, { CollectionName } from 'server/database';
import { PRIMARY_SHADOW } from 'theme/shadows';
import { LexioDivina } from 'types/interfaces';

interface FormInput {
  phrase: string;
  bible: Bible;
  chapter: string;
  verse: string;
  endChapter?: string;
  endVerse?: string;
  content: string;
}

interface ContemplationProps {
  lexioDivinaUserId?: string;
  defaultValues?: FormInput;
}

export const getServerSideProps: GetServerSideProps<
  ContemplationProps
> = async ({ query }) => {
  try {
    const id = query?.id;

    // 생성하는 경우
    if (!id) {
      return {
        props: {},
      };
    }

    // 수정하는 경우
    if (typeof id === 'string') {
      const db = new Database();
      const lexioDivina = await db.findOne<LexioDivina>(
        CollectionName.LexioDivinas,
        {
          _id: new ObjectId(id),
        }
      );

      if (!lexioDivina) {
        return {
          notFound: true,
        };
      }

      let defaultValues: FormInput = {
        phrase: lexioDivina.phrase,
        bible: lexioDivina.bible,
        chapter: String(lexioDivina.chapter),
        verse: String(lexioDivina.verse),
        content: lexioDivina.content,
      };

      if (lexioDivina.endChapter && lexioDivina.endVerse) {
        defaultValues = {
          ...defaultValues,
          endChapter: String(lexioDivina.endChapter),
          endVerse: String(lexioDivina.endVerse),
        };
      }

      return {
        props: {
          lexioDivinaUserId: String(lexioDivina.userId),
          defaultValues,
        },
      };
    }
  } catch (error) {
    console.error(error);
  }

  return {
    notFound: true,
  };
};

const Contemplation: NextPage<ContemplationProps> = ({
  lexioDivinaUserId,
  defaultValues,
}) => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { user, logout } = useAuth();

  const form = useForm<FormInput>({
    defaultValues: defaultValues
      ? defaultValues
      : {
          bible: Bible.Genesis,
        },
  });

  const [isRequested, setIsRequested] = useState(false);

  const handleCancel = () => {
    router.back();
  };

  const onSubmit: SubmitHandler<FormInput> = async ({
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
      const id = router.query?.id;

      const payload = {
        bible,
        content,
        phrase,
        chapter: Number(chapter),
        verse: Number(verse),
        endChapter: endChapter ? Number(endChapter) : 0,
        endVerse: endVerse ? Number(endVerse) : 0,
      };

      if (typeof id === 'string') {
        await putLexioDivina(id, payload);
      } else {
        await postLexioDivina({
          ...payload,
          userId: user._id,
          likedUserIds: [],
          comments: [],
        });
      }

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

  // 사용자가 작성한 글이 아닌 경우
  if (lexioDivinaUserId && lexioDivinaUserId !== user._id) {
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
              defaultIsExpanded={!!defaultValues?.endChapter}
              onCancel={handleCancel}
              onSubmit={onSubmit}
            />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Contemplation;
