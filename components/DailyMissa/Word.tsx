import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {
  isBibleChapterVerseNumberNext,
  isEndText,
  isStartWithDoubleCircle,
  isStartWithLordWord,
  isStartWithNumber,
} from 'helpers/bible-text';

type WordProps = {
  title: string;
  content: string;
};

const Word: React.FC<WordProps> = ({ title, content }) => {
  const parseToBibleParagraphs = (content: string) => {
    const paragraphs: string[] = [];
    let queue = '';

    // 배열에 넣어서 줄바꿈을 구분
    // char를 queue에 계속 넣다가 일치하는 조건이 발생하면 paragraphs에 push
    for (let i = 0; i < content.length; i++) {
      const char = content[i];
      queue += char;

      const nextChar = content[i + 1];
      const remainContent = content.substring(i + 1);

      if (
        // Ex. '하느님이다. 3 너에게는'
        //               ^
        (isEndText(queue) && isStartWithNumber(remainContent)) ||
        // Ex. '<너는 분별력을 청하였다.>'
        //                         ^
        char === '>' ||
        // Ex. '20,1-17 가'
        //              ^
        isBibleChapterVerseNumberNext(queue + nextChar) ||
        // Ex. '주님의 말씀입니다. ◎'
        //      ^
        isStartWithLordWord(remainContent) ||
        // Ex. '◎ 하느님, 감사합니다.'
        //      ^
        isStartWithDoubleCircle(remainContent)
      ) {
        paragraphs.push(queue);
        queue = '';
      }
    }

    if (queue.length > 0) {
      paragraphs.push(queue);
    }

    return paragraphs;
  };

  return (
    <Box>
      <Typography variant="h6" color="text.primary">
        {title}
      </Typography>
      {parseToBibleParagraphs(content).map((paragraph, index) => (
        <Typography key={index} color="text.primary">
          {paragraph}
        </Typography>
      ))}
    </Box>
  );
};

export default Word;
