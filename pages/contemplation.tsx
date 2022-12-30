import {
  Box,
  Button,
  IconButton,
  MenuItem,
  Paper,
  Typography,
} from '@mui/material';
import { Container } from '@mui/system';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import GlobalHeader from '../components/GlobalHeader';
import { addPost, getPost, updatePost } from '../libs/firebase/apis';
import { Bible, bibleOptions } from '../libs/firebase/constants';
import { Post } from '../libs/firebase/interfaces';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import YoutubeVideo from '../components/YoutubeVideo';
import FilledTextField from '../components/FilledTextField';
import FilledSelect from '../components/FilledSelect';
import useAuth from '../hooks/context/useAuth';

interface FormInput {
  phrase: string;
  bible: Bible;
  startedChapter: string;
  startedVerse: string;
  endedChapter?: string;
  endedVerse?: string;
  content: string;
}

interface ContemplationProps {
  postUserId?: string;
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
      const post = await getPost(id);

      let defaultValues: FormInput = {
        phrase: post.phrase,
        bible: post.bible,
        startedChapter: String(post.startedChapter),
        startedVerse: String(post.startedVerse),
        content: post.content,
      };

      if (post.endedChapter && post.endedVerse) {
        defaultValues = {
          ...defaultValues,
          endedChapter: String(post.endedChapter),
          endedVerse: String(post.endedVerse),
        };
      }

      return {
        props: {
          postUserId: post.user.id,
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
  postUserId,
  defaultValues,
}) => {
  const router = useRouter();
  const { user } = useAuth();

  const {
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
  const [isExpanded, setIsExpanded] = useState(!!defaultValues?.endedChapter);

  const handleCancel = () => {
    router.back();
  };

  const onSubmit: SubmitHandler<FormInput> = async ({
    bible,
    content,
    phrase,
    startedChapter,
    startedVerse,
    endedChapter,
    endedVerse,
  }) => {
    if (!user) return;

    setIsRequested(true);
    try {
      const id = router.query?.id;
      const now = new Date().getTime();

      let payload: Omit<Post, 'id' | 'createdAt' | 'likedUsers' | 'comments'> =
        {
          bible,
          content,
          user,
          phrase,
          startedChapter: Number(startedChapter),
          startedVerse: Number(startedVerse),
          endedChapter: endedChapter ? Number(endedChapter) : 0,
          endedVerse: endedVerse ? Number(endedVerse) : 0,
          updatedAt: now,
        };

      if (typeof id === 'string') {
        await updatePost(id, payload);
      } else {
        await addPost({
          ...payload,
          createdAt: now,
          likedUsers: {},
          comments: [],
        });
      }

      router.push('/');
    } catch (error) {
      console.error(error);
    } finally {
      setIsRequested(false);
    }
  };

  const handleClickPlusButton = () => {
    setIsExpanded(true);
  };

  const handleClickMinusButton = () => {
    setIsExpanded(false);
    setValue('endedChapter', '');
    setValue('endedVerse', '');
  };

  // 로그인을 하지 않았을 경우
  if (!user) {
    // TODO: 로그인 필요
    return <Box>접근 불가</Box>;
  }

  // 사용자가 작성한 글이 아닌 경우
  if (postUserId && postUserId !== user.id) {
    // TODO: 다른 글 접근 불가
    return <Box>접근 불가</Box>;
  }

  return (
    <>
      <Head>
        <title>머물음</title>
        <meta name="description" content="머물음 웹" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <GlobalHeader />

      <Container component="main" maxWidth="lg">
        <Box
          display="grid"
          gap={2}
          gridTemplateColumns={{
            sm: '1fr',
            md: '1fr 1fr',
          }}
          py={2}
        >
          <Box display="flex" flexDirection="column" gap={2}>
            <YoutubeVideo videoId="f742p7mQ0Ic" />

            <Paper sx={{ borderRadius: 6, p: 2 }}>
              <Typography
                variant="h5"
                fontWeight={600}
                color="text.primary"
                gutterBottom
              >
                오늘의 말씀
              </Typography>

              <Typography
                color="text.secondary"
                sx={{ whiteSpace: 'pre-line' }}
              >
                {`1 내가 인간의 여러 언어와 천사의 언어로 말한다 하여도 나에게 사랑이 없으면 나는 요란한 징이나 소란한 꽹과리에 지나지 않습니다. 
                  2 내가 예언하는 능력이 있고 모든 신비와 모든 지식을 깨닫고 산을 옮길 수 있는 큰 믿음이 있다 하여도 나에게 사랑이 없으면 나는 아무것도 아닙니다. 
                  3 내가 모든 재산을 나누어 주고 내 몸까지 자랑스레 넘겨준다 하여도 나에게 사랑이 없으면 나에게는 아무 소용이 없습니다. 
                  4 사랑은 참고 기다립니다. 사랑은 친절합니다. 사랑은 시기하지 않고 뽐내지 않으며 교만하지 않습니다. 
                  5 사랑은 무례하지 않고 자기 이익을 추구하지 않으며 성을 내지 않고 앙심을 품지 않습니다. 
                  6 사랑은 불의에 기뻐하지 않고 진실을 두고 함께 기뻐합니다. 
                  7 사랑은 모든 것을 덮어 주고 모든 것을 믿으며 모든 것을 바라고 모든 것을 견디어 냅니다. 
                  8 사랑은 언제까지나 스러지지 않습니다. 예언도 없어지고 신령한 언어도 그치고 지식도 없어집니다.`}
              </Typography>
            </Paper>
          </Box>

          <Box
            component="form"
            display="flex"
            flexDirection="column"
            gap={2}
            onSubmit={handleSubmit(onSubmit)}
            pb={20}
          >
            <Paper
              sx={{
                borderRadius: 6,
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5,
              }}
            >
              <Box>
                <FilledTextField
                  {...register('phrase', {
                    required: true,
                  })}
                  fullWidth
                  multiline
                  minRows={2}
                  placeholder="마음에 와닿은 구절"
                  // error={!!errors.phrase}
                />
              </Box>

              <Box
                display="grid"
                gridTemplateColumns="1fr 1fr 1fr auto"
                gap={1.5}
              >
                <Box>
                  <FilledSelect
                    {...register('bible', {
                      required: true,
                    })}
                    defaultValue={Bible.Genesis}
                    fullWidth
                  >
                    {bibleOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </FilledSelect>
                </Box>
                <Box>
                  <FilledTextField
                    {...register('startedChapter', {
                      required: true,
                      validate: {
                        moreThanOne: (value) => Number(value) > 0,
                      },
                    })}
                    placeholder="장"
                    fullWidth
                    type="number"
                    // error={!!errors.startedChapter}
                  />
                </Box>
                <Box>
                  <FilledTextField
                    {...register('startedVerse', {
                      required: true,
                      validate: {
                        moreThanOne: (value) => Number(value) > 0,
                      },
                    })}
                    placeholder="절"
                    fullWidth
                    type="number"
                    // error={!!errors.startedVerse}
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
                      <FilledTextField
                        {...register('endedChapter', {
                          validate: {
                            onlyPlus: (value) => !value || Number(value) >= 1,
                            moreThanStartedChapter: (value) =>
                              !value ||
                              Number(value) >=
                                Number(getValues('startedChapter')),
                            haveBoth: (value) =>
                              (!!value && !!getValues('endedVerse')) ||
                              (!value && !getValues('endedVerse')),
                          },
                        })}
                        placeholder="장"
                        fullWidth
                        type="number"
                        // error={!!errors.endedChapter}
                      />
                    </Box>
                    <Box>
                      <FilledTextField
                        {...register('endedVerse', {
                          validate: {
                            onlyPlus: (value) => !value || Number(value) >= 1,
                            moreThanStarted: (value) =>
                              !value ||
                              Number(getValues('startedChapter')) <
                                Number(getValues('endedChapter')) ||
                              Number(value) > Number(getValues('startedVerse')),
                            haveBoth: (value) =>
                              (!!value && !!getValues('endedChapter')) ||
                              (!value && !getValues('endedChapter')),
                          },
                        })}
                        placeholder="절"
                        fullWidth
                        type="number"
                        // error={!!errors.endedVerse}
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
            </Paper>

            <Paper sx={{ borderRadius: 6, p: 2 }}>
              <Box>
                <FilledTextField
                  {...register('content', {
                    required: true,
                  })}
                  fullWidth
                  multiline
                  minRows={15}
                  placeholder="구절을 통해 느낀점"
                  // error={!!errors.content}
                />
              </Box>
            </Paper>

            <Box display="flex" justifyContent="flex-end" gap={1}>
              <Button onClick={handleCancel}>취소</Button>
              <Button type="submit" variant="contained" disabled={isRequested}>
                저장
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default Contemplation;
