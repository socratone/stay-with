import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import { Box, useTheme } from '@mui/material';
import { PRIMARY_BOX_SHADOW } from '../../theme/boxShadow';
import { useState } from 'react';
import SearchIcon from './SearchIcon';

const GlobalFooter = () => {
  const theme = useTheme();
  const [value, setValue] = useState(0);

  return (
    <Box
      component="footer"
      boxShadow={PRIMARY_BOX_SHADOW}
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        zIndex: 10,
        bgcolor: theme.palette.paper?.main,
      }}
    >
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
      >
        <BottomNavigationAction
          label="찾기"
          icon={<SearchIcon />}
          sx={{
            svg: {
              width: 30,
              height: 30,
            },
          }}
        />
        <BottomNavigationAction
          label="찾기"
          icon={<SearchIcon />}
          sx={{
            svg: {
              width: 30,
              height: 30,
            },
          }}
        />
        <BottomNavigationAction
          label="찾기"
          icon={<SearchIcon />}
          sx={{
            svg: {
              width: 30,
              height: 30,
            },
          }}
        />
        <BottomNavigationAction
          label="찾기"
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
