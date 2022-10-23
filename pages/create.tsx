import { Box, InputLabel, TextField } from '@mui/material';
import { Container } from '@mui/system';
import { NextPage } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import Select from '../components/common/Select';
import NavigationFooter from '../components/NavigationFooter';

const Create: NextPage = () => {
  const [phrase, setPhrase] = useState('');
  const [book, setBook] = useState('genesis');
  const [chapter, setChapter] = useState('1');
  const [verse, setVerse] = useState('1');
  const [content, setContent] = useState('');

  const handlePhraseChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setPhrase(event.target.value);
  };
  const handleBookChange = (value: string) => setBook(value);
  const handleChapterChange = (value: string) => setChapter(value);
  const handleVerseChange = (value: string) => setVerse(value);
  const handleContentChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setContent(event.target.value);
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
                value={book}
                onChange={handleBookChange}
                options={[
                  // TODO: option을 더 늘려야
                  {
                    value: 'genesis',
                    label: '창세기',
                  },
                  {
                    value: 'exodus',
                    label: '탈출기',
                  },
                ]}
              />
            </Box>
            <Box flexGrow={1}>
              <Select
                value={chapter}
                onChange={handleChapterChange}
                options={[
                  {
                    value: '1',
                    label: '1',
                  },
                  {
                    value: '2',
                    label: '2',
                  },
                ]}
              />
            </Box>
            <Box flexGrow={1}>
              <Select
                value={verse}
                onChange={handleVerseChange}
                options={[
                  {
                    value: '1',
                    label: '1',
                  },
                  {
                    value: '2',
                    label: '2',
                  },
                ]}
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
        </Box>
      </Container>

      <NavigationFooter />
    </>
  );
};

export default Create;
