import CreateIcon from '@mui/icons-material/Create';
import HomeIcon from '@mui/icons-material/Home';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useRouter } from 'next/router';
import React from 'react';

interface GlobalHeaderDrawerProps {
  open: boolean;
  onClose: () => void;
}

const GlobalHeaderDrawer: React.FC<GlobalHeaderDrawerProps> = ({
  open,
  onClose,
}) => {
  const router = useRouter();

  const handleClick = (link: string) => {
    router.push(link);
    onClose();
  };

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
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={() => handleClick('/')}>
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="홈" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => handleClick('/contemplation')}>
              <ListItemIcon>
                <CreateIcon />
              </ListItemIcon>
              <ListItemText primary="묵상글 쓰기" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
};

export default GlobalHeaderDrawer;
