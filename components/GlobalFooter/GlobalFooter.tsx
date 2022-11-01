import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import { Box, useTheme } from '@mui/material';
import { PRIMARY_BOX_SHADOW } from '../../theme/boxShadow';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

interface GlobalFooterProps {
  hidden: boolean;
}

const GlobalFooter: React.FC<GlobalFooterProps> = ({ hidden }) => {
  const router = useRouter();
  const theme = useTheme();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (router.pathname === '/pray') {
      setValue(1);
    } else {
      setValue(0);
    }
  }, [router]);

  return (
    <Box
      component="footer"
      boxShadow={PRIMARY_BOX_SHADOW}
      sx={{
        transition: 'all 0.3s ease',
        position: 'fixed',
        bottom: hidden ? -50 : 0,
        left: 0,
        width: '100%',
        zIndex: 10,
        bgcolor: theme.palette.paper?.main,
      }}
    >
      <BottomNavigation
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
        sx={{ height: 50 }}
      >
        <BottomNavigationAction
          showLabel
          label="나눔"
          onClick={() => router.push('/')}
        />
        <BottomNavigationAction
          showLabel
          label="기도"
          onClick={() => router.push('/pray')}
        />
      </BottomNavigation>
    </Box>
  );
};

export default GlobalFooter;
