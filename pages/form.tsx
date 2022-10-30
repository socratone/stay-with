import {
  Box,
  Button,
  InputLabel,
  MenuItem,
  Select,
  TextField,
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
import { User } from '../libs/firebase/interfaces';

interface IFormInput {
  phrase: string;
  bible: Bible;
  chapter: string;
  verse: string;
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

      return {
        props: {
          defaultValues: {
            phrase: post.phrase,
            bible: post.bible,
            chapter: String(post.startedChapter),
            verse: String(post.startedVerse),
            content: post.content,
          },
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
    chapter,
    verse,
  }) => {
    if (!user) return;

    setIsRequested(true);
    try {
      const id = router.query?.id;

      if (typeof id === 'string') {
        await updatePost(id, {
          bible,
          content,
          user,
          phrase,
          startedChapter: Number(chapter),
          startedVerse: Number(verse),
        });
      } else {
        await addPost({
          bible,
          content,
          user,
          phrase,
          startedChapter: Number(chapter),
          startedVerse: Number(verse),
        });
      }

      router.push('/');
    } catch (error) {
      console.error(error);
    } finally {
      setIsRequested(false);
    }
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
              error={!!errors.phrase}
            />
          </Box>
          <Box display="flex" gap={2}>
            <Box flexGrow={1}>
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
            <Box flexGrow={1}>
              <TextField
                {...register('chapter', {
                  required: true,
                })}
                fullWidth
                size="small"
                type="number"
                error={!!errors.chapter}
              />
            </Box>
            <Box flexGrow={1}>
              <TextField
                {...register('verse', {
                  required: true,
                })}
                fullWidth
                size="small"
                type="number"
                error={!!errors.verse}
              />
            </Box>
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
              rows={10}
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
