import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

type WordProps = {
  title: string;
  bible: string | null;
  bibleInfo: string;
  contents: string[];
};

// TODO: bible을 활용
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Word: React.FC<WordProps> = ({ title, bible, bibleInfo, contents }) => {
  return (
    <Box>
      <Typography variant="h6" color="text.primary">
        {title}
      </Typography>
      <Typography color="text.primary">{bibleInfo}</Typography>
      {contents.map((content, index) => (
        <Typography key={index} color="text.primary">
          {content}
        </Typography>
      ))}
    </Box>
  );
};

export default Word;
