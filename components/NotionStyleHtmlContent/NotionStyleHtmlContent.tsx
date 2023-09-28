import { styled } from '@mui/material';
import Box from '@mui/material/Box';
import { ElementType } from 'react';

type NotionStyleHtmlContentProps = {
  html?: string;
  component?: ElementType<any>;
  children?: React.ReactNode;
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
    margin-top: 1.4rem; /* 22.4px */
  }

  h3 {
    font-size: ${({ theme }) => theme.typography.mh3.fontSize};
    line-height: ${({ theme }) => theme.typography.mh3.lineHeight};
    font-weight: ${({ theme }) => theme.typography.mh3.fontWeight};
    padding: ${({ theme }) => theme.typography.mh3.padding};
    margin: ${({ theme }) => theme.typography.mh3.margin};
    margin-top: 1rem; /* 16px */
  }

  p {
    font-size: ${({ theme }) => theme.typography.mp.fontSize};
    line-height: ${({ theme }) => theme.typography.mp.lineHeight};
    font-weight: ${({ theme }) => theme.typography.mp.fontWeight};
    padding: ${({ theme }) => theme.typography.mp.padding};
    margin: ${({ theme }) => theme.typography.mp.margin};
  }

  > ul,
  > ol {
    padding: ${({ theme }) => theme.typography.mp.padding};
    margin: ${({ theme }) => theme.typography.mp.margin};
  }

  ul,
  ol {
    font-size: ${({ theme }) => theme.typography.mp.fontSize};
    line-height: ${({ theme }) => theme.typography.mp.lineHeight};
    font-weight: ${({ theme }) => theme.typography.mp.fontWeight};
    padding-left: 1.375rem; /* 22px */
  }

  li {
    line-height: 1.8;
  }

  a {
    color: dodgerblue;
  }

  /* single line code */

  code {
    font-family: inherit;
    font-size: 85%;
    color: #eb5757;
    background: rgba(135, 131, 120, 0.15);
    border-radius: 3px;
    padding: 2.72px 5.44px;
  }

  /* multi line code */

  pre {
    padding: 34px 16px 32px 32px;
    background: rgb(247, 246, 243);
    overflow-x: auto;
  }

  pre > code {
    font-family: inherit;
    font-size: ${({ theme }) => theme.typography.mp.fontSize};
    color: #690;
    background: unset;
    border-radius: unset;
    padding: unset;
  }
`;

const NotionStyleHtmlContent: React.FC<NotionStyleHtmlContentProps> = ({
  html,
  component,
  children,
}) => {
  return (
    <StyledBox
      component={component}
      dangerouslySetInnerHTML={html ? { __html: html } : undefined}
    >
      {children}
    </StyledBox>
  );
};

export default NotionStyleHtmlContent;
