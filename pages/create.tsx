import {
  Box,
  Button,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { Container } from '@mui/system';
import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { SubmitHandler, useForm } from 'react-hook-form';
import NavigationFooter from '../components/NavigationFooter';
import { addPost } from '../libs/firebase/apis';
import { Bible, bibleOptions } from '../libs/firebase/constants';

interface IFormInput {
  phrase: string;
  bible: Bible;
  chapter: string;
  verse: string;
  content: string;
}

const Create: NextPage = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    defaultValues: {
      bible: Bible.Genesis,
    },
  });

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
    try {
      await addPost({
        bible,
        content,
        name: '김기원', // TODO: user name
        phrase,
        startedChapter: Number(chapter),
        startedVerse: Number(verse),
      });

      router.push('/');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Head>
        <title>머물음</title>
        <meta name="description" content="머물음 웹" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container component="main" maxWidth="sm">
        <Box
          component="form"
          display="flex"
          flexDirection="column"
          gap={2}
          onSubmit={handleSubmit(onSubmit)}
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
            <Button type="submit" variant="contained">
              저장
            </Button>
          </Box>
        </Box>
      </Container>

      <NavigationFooter />
    </>
  );
};

export default Create;
