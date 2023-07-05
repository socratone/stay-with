import { styled } from '@mui/material';
import Box from '@mui/material/Box';

type NotionStyleHtmlContentProps = {
  html: string;
};

const StyledBox = styled(Box)`
  display: flex;
  flex-direction: column;

  font-family: ${({ theme }) => theme.typography.fontFamily};
  color: ${({ theme }) => theme.palette.text.primary};

  h1 {
    font-size: ${({ theme }) => theme.typography.mh1.fontSize};
    line-height: ${({ theme }) => theme.typography.mh1.lineHeight};
    font-weight: ${({ theme }) => theme.typography.mh1.fontWeight};
    padding: ${({ theme }) => theme.typography.mh1.padding};
    margin: ${({ theme }) => theme.typography.mh1.margin};
  }

  h2 {
    font-size: ${({ theme }) => theme.typography.mh2.fontSize};
    line-height: ${({ theme }) => theme.typography.mh2.lineHeight};
    font-weight: ${({ theme }) => theme.typography.mh2.fontWeight};
    padding: ${({ theme }) => theme.typography.mh2.padding};
    margin: ${({ theme }) => theme.typography.mh2.margin};
  }

  h3 {
    font-size: ${({ theme }) => theme.typography.mh3.fontSize};
    line-height: ${({ theme }) => theme.typography.mh3.lineHeight};
    font-weight: ${({ theme }) => theme.typography.mh3.fontWeight};
    padding: ${({ theme }) => theme.typography.mh3.padding};
    margin: ${({ theme }) => theme.typography.mh3.margin};
  }

  p {
    font-size: ${({ theme }) => theme.typography.mp.fontSize};
    line-height: ${({ theme }) => theme.typography.mp.lineHeight};
    font-weight: ${({ theme }) => theme.typography.mp.fontWeight};
    padding: ${({ theme }) => theme.typography.mp.padding};
    margin: ${({ theme }) => theme.typography.mp.margin};
  }

  > ul {
    padding: ${({ theme }) => theme.typography.mp.padding};
    margin: ${({ theme }) => theme.typography.mp.margin};
  }

  ul {
    font-size: ${({ theme }) => theme.typography.mp.fontSize};
    line-height: ${({ theme }) => theme.typography.mp.lineHeight};
    font-weight: ${({ theme }) => theme.typography.mp.fontWeight};
    padding-left: 1.375rem; /* 22px */
  }
`;

const NotionStyleHtmlContent: React.FC<NotionStyleHtmlContentProps> = ({
  html,
}) => {
  return (
    <StyledBox component="article" dangerouslySetInnerHTML={{ __html: html }} />
  );
};

export default NotionStyleHtmlContent;
