import { Box, Button, InputLabel, TextField } from '@mui/material';
import { Container } from '@mui/system';
import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Select from '../components/common/Select';
import NavigationFooter from '../components/NavigationFooter';
import { addPost } from '../libs/firebase/apis';
import { Bible, bibleOptions } from '../libs/firebase/constants';

const Create: NextPage = () => {
  const router = useRouter();

  const [phrase, setPhrase] = useState('');
  const [bible, setBible] = useState<Bible>(Bible.Genesis);
  const [chapter, setChapter] = useState('1');
  const [verse, setVerse] = useState('1');
  const [content, setContent] = useState('');

  const handlePhraseChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setPhrase(event.target.value);
  };
  const handleBibleChange = (value: string) => setBible(value as Bible);
  const handleChapterChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setChapter(event.target.value);
  const handleVerseChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setVerse(event.target.value);
  const handleContentChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setContent(event.target.value);
  };

  const handleCancel = () => {
    router.back();
  };

  const handleSubmit = async () => {
    // TODO: error handling
    const response = await addPost({
      bible,
      content,
      name: '김기원', // TODO: user name
      phrase,
      startedChapter: Number(chapter),
      startedVerse: Number(verse),
    });

    router.push('/');
  };

  return (
    <>
      <Head>
        <title>머물음</title>
        <meta name="description" content="머물음 웹" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container component="main" maxWidth="sm">
        <Box display="flex" flexDirection="column" gap={2}>
          <Box>
            <InputLabel shrink htmlFor="phrase-input">
              마음에 와닿은 구절
            </InputLabel>
            <TextField
              id="phrase-input"
              size="small"
              fullWidth
              value={phrase}
              onChange={handlePhraseChange}
            />
          </Box>
          <Box display="flex" gap={2}>
            <Box flexGrow={1}>
              <Select
                value={bible}
                onChange={handleBibleChange}
                options={bibleOptions}
              />
            </Box>
            <Box flexGrow={1}>
              <TextField
                value={chapter}
                onChange={handleChapterChange}
                fullWidth
                size="small"
                type="number"
              />
            </Box>
            <Box flexGrow={1}>
              <TextField
                value={verse}
                onChange={handleVerseChange}
                fullWidth
                size="small"
                type="number"
              />
            </Box>
          </Box>
          <Box>
            <InputLabel shrink htmlFor="content-input">
              구절을 통해 느낀점
            </InputLabel>
            <TextField
              id="content-input"
              size="small"
              fullWidth
              multiline
              rows={10}
              value={content}
              onChange={handleContentChange}
            />
          </Box>
          <Box display="flex" justifyContent="flex-end" gap={1}>
            <Button onClick={handleCancel}>취소</Button>
            <Button onClick={handleSubmit} variant="contained">
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
