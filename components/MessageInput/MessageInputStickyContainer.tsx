import { alpha, useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import React from 'react';

type MessageInputStickyContainerProps = {
  children: React.ReactNode;
};

const MessageInputStickyContainer: React.FC<
  MessageInputStickyContainerProps
> = ({ children }) => {
  const theme = useTheme();
  const { mode } = theme.palette;
  const bgcolor = mode === 'light' ? '#fff' : '#000';

  return (
    <Box
      sx={{
        zIndex: (theme) => theme.zIndex.appBar,
        bgcolor,
        position: 'sticky',
        bottom: 0,
        mt: 'auto',
        pb: 1.5,
        '&::before': {
          position: 'absolute',
          content: '""',
          bottom: '100%',
          width: '100%',
          height: (theme) => theme.spacing(2),
          background: `linear-gradient(0deg, ${bgcolor} 0%, ${alpha(
            bgcolor,
            0
          )} 100%)`,
        },
      }}
    >
      {children}
    </Box>
  );
};

export default MessageInputStickyContainer;
