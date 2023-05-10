import CloseIcon from '@mui/icons-material/Close';
import HomeIcon from '@mui/icons-material/Home';
import SettingsIcon from '@mui/icons-material/Settings';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import React from 'react';

import ListLinkItem from './ListLinkItem';

type GlobalHeaderDrawerProps = {
  open: boolean;
  onClose: () => void;
};

const GlobalHeaderDrawer: React.FC<GlobalHeaderDrawerProps> = ({
  open,
  onClose,
}) => {
  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: '100%',
          maxWidth: { xs: '100%', sm: 250, md: 250 },
        },
      }}
    >
      <Box display="flex" flexDirection="column" height="100%">
        <Box component="header" py={1} px={2}>
          <IconButton onClick={onClose} sx={{ ml: -1 }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <List sx={{ pt: 0 }}>
          <ListLinkItem href="/" icon={<HomeIcon />} label="홈" />
          <ListLinkItem
            href="/settings/profile"
            icon={<SettingsIcon />}
            label="설정"
          />
        </List>
      </Box>
    </Drawer>
  );
};

export default GlobalHeaderDrawer;
