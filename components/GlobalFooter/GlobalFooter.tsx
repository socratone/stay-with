import { Box, ButtonBase, Typography, useTheme } from '@mui/material';
import { PRIMARY_BOX_SHADOW } from '../../theme/boxShadow';
import Link from 'next/link';

interface GlobalFooterProps {
  hidden: boolean;
}

const GlobalFooter: React.FC<GlobalFooterProps> = ({ hidden }) => {
  const theme = useTheme();

  return (
    <Box
      component="footer"
      boxShadow={PRIMARY_BOX_SHADOW}
      sx={{
        display: 'flex',
        transition: 'all 0.3s ease',
        position: 'fixed',
        bottom: hidden ? -50 : 0,
        left: 0,
        width: '100%',
        zIndex: 10,
        bgcolor: theme.palette.paper?.main,
        height: 50,
      }}
    >
      <Link href="/">
        <ButtonBase sx={{ height: '100%', flexGrow: 1 }}>
          <Typography>나눔</Typography>
        </ButtonBase>
      </Link>
      <Link href="/pray">
        <ButtonBase sx={{ height: '100%', flexGrow: 1 }}>
          <Typography>기도</Typography>
        </ButtonBase>
      </Link>
    </Box>
  );
};

export default GlobalFooter;
