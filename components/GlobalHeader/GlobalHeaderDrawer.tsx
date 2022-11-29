import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import React from 'react';
import HomeIcon from '@mui/icons-material/Home';
import CreateIcon from '@mui/icons-material/Create';
import { useRouter } from 'next/router';

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
