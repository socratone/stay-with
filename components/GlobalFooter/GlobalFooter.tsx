import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import { Box, useTheme } from '@mui/material';
import { PRIMARY_BOX_SHADOW } from '../../theme/boxShadow';
import { useState } from 'react';

interface GlobalFooterProps {
  hidden: boolean;
}

const bottomNavigationActionSx = {
  '.MuiBottomNavigationAction-label': {
    fontSize: 18,
  },
  '.Mui-selected': {
    fontSize: 20,
  },
};

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
          showLabel
          label="나눔"
          sx={bottomNavigationActionSx}
        />
        <BottomNavigationAction
          showLabel
          label="기도"
          sx={bottomNavigationActionSx}
        />
      </BottomNavigation>
    </Box>
  );
};

export default GlobalFooter;
