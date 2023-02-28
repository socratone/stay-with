import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import AccessDeniedMessage from 'components/AccessDeniedMessage';
import GlobalHeader from 'components/GlobalHeader';
import { GLOBAL_HEADER_HEIGHT } from 'components/GlobalHeader/GlobalHeader';
import LoginMessage from 'components/LoginMessage';
import { Bible, bibleOptions } from 'constants/bible';
import useAuth from 'hooks/context/useAuth';
import { postLexioDivina, putLexioDivina } from 'libs/axios/apis';
import { ObjectId } from 'mongodb';
import type { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
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

  const {
    control,
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<FormInput>({
    defaultValues: defaultValues
      ? defaultValues
      : {
          bible: Bible.Genesis,
        },
  });

  const [isRequested, setIsRequested] = useState(false);
  const [isExpanded, setIsExpanded] = useState(!!defaultValues?.endChapter);

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
      const now = new Date().getTime();

      const payload = {
        bible,
        content,
        phrase,
        chapter: Number(chapter),
        verse: Number(verse),
        endChapter: endChapter ? Number(endChapter) : 0,
        endVerse: endVerse ? Number(endVerse) : 0,
        updatedAt: now,
      };

      if (typeof id === 'string') {
        await putLexioDivina(id, payload);
      } else {
        await postLexioDivina({
          ...payload,
          userId: user._id,
          createdAt: now,
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

  const handleClickPlusButton = () => {
    setIsExpanded(true);
  };

  const handleClickMinusButton = () => {
    setIsExpanded(false);
    setValue('endChapter', '');
    setValue('endVerse', '');
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
      <Head>
        <title>머물음</title>
        <meta name="description" content="머물음 웹" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

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
            component="form"
            display="flex"
            flexDirection="column"
            gap={2}
            onSubmit={handleSubmit(onSubmit)}
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
            <Box
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5,
              }}
            >
              <Box>
                <TextField
                  {...register('phrase', {
                    required: true,
                  })}
                  size="small"
                  fullWidth
                  multiline
                  minRows={2}
                  placeholder="마음에 와닿은 구절"
                  error={!!errors.phrase}
                />
              </Box>

              <Box
                display="grid"
                gridTemplateColumns="1fr 1fr 1fr auto"
                gap={1.5}
              >
                <Box>
                  <Controller
                    control={control}
                    name="bible"
                    render={({ field }) => (
                      <Select
                        {...field}
                        size="small"
                        defaultValue={Bible.Genesis}
                        fullWidth
                      >
                        {bibleOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                </Box>
                <Box>
                  <TextField
                    {...register('chapter', {
                      required: true,
                      validate: {
                        moreThanOne: (value) => Number(value) > 0,
                      },
                    })}
                    size="small"
                    placeholder="장"
                    fullWidth
                    type="number"
                    error={!!errors.chapter}
                  />
                </Box>
                <Box>
                  <TextField
                    {...register('verse', {
                      required: true,
                      validate: {
                        moreThanOne: (value) => Number(value) > 0,
                      },
                    })}
                    size="small"
                    placeholder="절"
                    fullWidth
                    type="number"
                    error={!!errors.verse}
                  />
                </Box>
                <Box ml={-1.5} alignSelf="center">
                  {isExpanded ? (
                    <Typography color="text.primary" textAlign="end">
                      에서
                    </Typography>
                  ) : (
                    <IconButton onClick={handleClickPlusButton}>
                      <AddCircleOutlineIcon />
                    </IconButton>
                  )}
                </Box>

                {isExpanded ? (
                  <>
                    <Box justifySelf="flex-end" alignSelf="center" mr={-1.5}>
                      <IconButton onClick={handleClickMinusButton}>
                        <RemoveCircleOutlineIcon />
                      </IconButton>
                    </Box>
                    <Box>
                      <TextField
                        {...register('endChapter', {
                          validate: {
                            onlyPlus: (value) => !value || Number(value) >= 1,
                            moreThanStartChapter: (value) =>
                              !value ||
                              Number(value) >= Number(getValues('chapter')),
                            haveBoth: (value) =>
                              (!!value && !!getValues('endVerse')) ||
                              (!value && !getValues('endVerse')),
                          },
                        })}
                        size="small"
                        placeholder="장"
                        fullWidth
                        type="number"
                        error={!!errors.endChapter}
                      />
                    </Box>
                    <Box>
                      <TextField
                        {...register('endVerse', {
                          validate: {
                            onlyPlus: (value) => !value || Number(value) >= 1,
                            moreThanStarted: (value) =>
                              !value ||
                              Number(getValues('chapter')) <
                                Number(getValues('endChapter')) ||
                              Number(value) > Number(getValues('verse')),
                            haveBoth: (value) =>
                              (!!value && !!getValues('endChapter')) ||
                              (!value && !getValues('endChapter')),
                          },
                        })}
                        size="small"
                        placeholder="절"
                        fullWidth
                        type="number"
                        error={!!errors.endVerse}
                      />
                    </Box>
                    <Box alignSelf="center">
                      <Typography color="text.primary" textAlign="end">
                        까지
                      </Typography>
                    </Box>
                  </>
                ) : null}
              </Box>

              <Box>
                <TextField
                  {...register('content', {
                    required: true,
                  })}
                  size="small"
                  fullWidth
                  multiline
                  minRows={15}
                  placeholder="구절을 통해 느낀점"
                  error={!!errors.content}
                />
              </Box>

              <Box display="flex" justifyContent="flex-end" gap={1}>
                <Button variant="outlined" onClick={handleCancel}>
                  취소
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isRequested}
                >
                  저장
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Contemplation;
