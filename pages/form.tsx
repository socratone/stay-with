import {
  Box,
  Button,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { Container } from '@mui/system';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import GlobalHeader from '../components/GlobalHeader';
import { addPost, getPost, updatePost } from '../libs/firebase/apis';
import { Bible, bibleOptions } from '../libs/firebase/constants';
import { User, Post } from '../libs/firebase/interfaces';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

interface IFormInput {
  phrase: string;
  bible: Bible;
  startedChapter: string;
  startedVerse: string;
  endedChapter?: string;
  endedVerse?: string;
  content: string;
}

interface FormProps {
  defaultValues?: IFormInput;
}

export const getServerSideProps: GetServerSideProps<FormProps> = async (
  context
) => {
  const id = context.query?.id;

  // 생성하는 경우
  if (!id) {
    return {
      props: {},
    };
  }

  try {
    // 수정하는 경우
    if (typeof id === 'string') {
      // TODO: user가 생성한 postId가 아닌 경우 => 404

      const post = await getPost(id);

      let defaultValues: IFormInput = {
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

const Form: NextPage<FormProps> = ({ defaultValues }) => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<IFormInput>({
    defaultValues: defaultValues
      ? defaultValues
      : {
          bible: Bible.Genesis,
        },
  });

  const [isRequested, setIsRequested] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isExpanded, setIsExpanded] = useState(!!defaultValues?.endedChapter);

  // TODO: token으로 바꿔야 함
  useEffect(() => {
    const stringifyUser = localStorage.getItem('user');
    if (stringifyUser) {
      const user = JSON.parse(stringifyUser);
      setUser(user);
    } else {
      router.push('/login');
    }
  }, [router]);

  const handleCancel = () => {
    router.back();
  };

  const onSubmit: SubmitHandler<IFormInput> = async ({
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

      let payload: Omit<Post, 'id' | 'createdAt'> = {
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

  return (
    <>
      <Head>
        <title>머물음</title>
        <meta name="description" content="머물음 웹" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <GlobalHeader />

      <Container component="main" maxWidth="sm">
        <Box
          component="form"
          display="flex"
          flexDirection="column"
          gap={2}
          onSubmit={handleSubmit(onSubmit)}
          py={2}
        >
          <Box>
            <InputLabel shrink htmlFor="phrase-input">
              마음에 와닿은 구절
            </InputLabel>
            <TextField
              {...register('phrase', {
                required: true,
              })}
              id="phrase-input"
              size="small"
              fullWidth
              multiline
              minRows={2}
              error={!!errors.phrase}
            />
          </Box>

          <Box display="grid" gridTemplateColumns="1fr 1fr 1fr auto" gap={2}>
            <Box>
              <Select
                {...register('bible', {
                  required: true,
                })}
                defaultValue={Bible.Genesis}
                fullWidth
                size="small"
              >
                {bibleOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </Box>
            <Box>
              <TextField
                {...register('startedChapter', {
                  required: true,
                  validate: {
                    moreThanOne: (value) => Number(value) > 0,
                  },
                })}
                placeholder="장"
                fullWidth
                size="small"
                type="number"
                error={!!errors.startedChapter}
              />
            </Box>
            <Box>
              <TextField
                {...register('startedVerse', {
                  required: true,
                  validate: {
                    moreThanOne: (value) => Number(value) > 0,
                  },
                })}
                placeholder="절"
                fullWidth
                size="small"
                type="number"
                error={!!errors.startedVerse}
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
                <Box justifySelf="flex-end" mr={-1.5}>
                  <IconButton onClick={handleClickMinusButton}>
                    <RemoveCircleOutlineIcon />
                  </IconButton>
                </Box>
                <Box>
                  <TextField
                    {...register('endedChapter', {
                      validate: {
                        onlyPlus: (value) => !value || Number(value) >= 1,
                        moreThanStartedChapter: (value) =>
                          !value ||
                          Number(value) >= Number(getValues('startedChapter')),
                        haveBoth: (value) =>
                          (!!value && !!getValues('endedVerse')) ||
                          (!value && !getValues('endedVerse')),
                      },
                    })}
                    placeholder="장"
                    fullWidth
                    size="small"
                    type="number"
                    error={!!errors.endedChapter}
                  />
                </Box>
                <Box>
                  <TextField
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
                    size="small"
                    type="number"
                    error={!!errors.endedVerse}
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
            <InputLabel shrink htmlFor="content-input">
              구절을 통해 느낀점
            </InputLabel>
            <TextField
              {...register('content', {
                required: true,
              })}
              id="content-input"
              size="small"
              fullWidth
              multiline
              minRows={15}
              error={!!errors.content}
            />
          </Box>
          <Box display="flex" justifyContent="flex-end" gap={1}>
            <Button onClick={handleCancel}>취소</Button>
            <Button type="submit" variant="contained" disabled={isRequested}>
              저장
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default Form;
