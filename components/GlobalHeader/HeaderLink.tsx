import { Typography } from '@mui/material';
import Link from 'next/link';

type HeaderLinkProps = {
  children: string;
  href: string;
};

const HeaderLink: React.FC<HeaderLinkProps> = ({ children, href }) => {
  return (
    <Link href={href}>
      <Typography
        color={(theme) => theme.palette.text.secondary}
        sx={{
          cursor: 'pointer',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          px: 0.5,
        }}
      >
        {children}
      </Typography>
    </Link>
  );
};

export default HeaderLink;
