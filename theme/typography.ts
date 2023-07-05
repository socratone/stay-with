import { TypographyOptions } from '@mui/material/styles/createTypography';

export const typography: TypographyOptions = {
  fontFamily: [
    'Pretendard',
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
  ].join(','),
  // markdown h1
  mh1: {
    fontSize: '1.875rem', // 30px
    lineHeight: 1.3,
    fontWeight: 600,
    padding: '3px 2px',
    margin: '1px 0',
  },
  // markdown h2
  mh2: {
    fontSize: '1.5rem', // 24px
    lineHeight: 1.3,
    fontWeight: 600,
    padding: '3px 2px',
    margin: '1px 0',
  },
  // markdown h3
  mh3: {
    fontSize: '1.25rem', // 20px
    lineHeight: 1.3,
    fontWeight: 600,
    padding: '3px 2px',
    margin: '1px 0',
  },
  // markdown p
  mp: {
    fontSize: '1rem', // 16px
    lineHeight: 1.5,
    fontWeight: 400,
    padding: '3px 2px',
    margin: '1px 0',
  },
};
