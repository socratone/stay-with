import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import { Box, useTheme } from '@mui/material';
import { PRIMARY_BOX_SHADOW } from '../../theme/boxShadow';
import { useState } from 'react';
import SearchIcon from './SearchIcon';

interface GlobalFooterProps {
  hidden: boolean;
}

const GlobalFooter: React.FC<GlobalFooterProps> = ({ hidden }) => {
  const theme = useTheme();
  const [value, setValue] = useState(0);

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
          icon={<SearchIcon />}
          sx={{
            svg: {
              width: 30,
              height: 30,
            },
          }}
        />
        <BottomNavigationAction
          icon={<SearchIcon />}
          sx={{
            svg: {
              width: 30,
              height: 30,
            },
          }}
        />
        <BottomNavigationAction
          icon={<SearchIcon />}
          sx={{
            svg: {
              width: 30,
              height: 30,
            },
          }}
        />
        <BottomNavigationAction
          icon={<SearchIcon />}
          sx={{
            svg: {
              width: 30,
              height: 30,
            },
          }}
        />
      </BottomNavigation>
    </Box>
  );
};

export default GlobalFooter;
