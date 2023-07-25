import Container from '@mui/material/Container';
import NotionStyleHtmlContent from 'components/NotionStyleHtmlContent';
import { GetStaticProps, NextPage } from 'next';
import { parseMarkdownFile, parseMarkdownToHtml } from 'utils/markdown';

type BlogProps = {
  metadata: {
    [key: string]: any;
  };
  htmlContent: string;
};

export const getStaticProps: GetStaticProps<BlogProps> = async () => {
  const { metadata, content } = parseMarkdownFile(
    'content/blogs/pentecost-sunday-sequence.md'
  );
  const htmlContent = await parseMarkdownToHtml(content);

  return { props: { metadata, htmlContent } };
};

// TODO: metadata 설정
const PentecostSundaySequenceBlog: NextPage<BlogProps> = ({ htmlContent }) => {
  return (
    <Container sx={{ py: 1 }}>
      <NotionStyleHtmlContent html={htmlContent} />
    </Container>
  );
};

export default PentecostSundaySequenceBlog;
