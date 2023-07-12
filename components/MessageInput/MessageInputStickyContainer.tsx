import { alpha } from '@mui/material';
import Box from '@mui/material/Box';
import React from 'react';

type MessageInputStickyContainerProps = {
  children: React.ReactNode;
};

const MessageInputStickyContainer: React.FC<
  MessageInputStickyContainerProps
> = ({ children }) => {
  return (
    <Box
      sx={{
        zIndex: (theme) => theme.zIndex.appBar,
        bgcolor: (theme) => theme.palette.background.paper,
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
          background: (theme) =>
            `linear-gradient(0deg, ${
              theme.palette.background.paper
            } 0%, ${alpha(theme.palette.background.paper, 0)} 100%)`,
        },
      }}
    >
      {children}
    </Box>
  );
};

export default MessageInputStickyContainer;
