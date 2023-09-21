import ArticleIcon from '@mui/icons-material/Article';
import CloseIcon from '@mui/icons-material/Close';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import HeadphonesIcon from '@mui/icons-material/Headphones';
import ImportContactsIcon from '@mui/icons-material/ImportContacts';
import SettingsIcon from '@mui/icons-material/Settings';
import WhatshotIcon from '@mui/icons-material/Whatshot';
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
          <ListLinkItem
            href="/"
            icon={<ImportContactsIcon />}
            label="렉시오 디비나"
          />
          <ListLinkItem
            href="/arrows"
            icon={<WhatshotIcon />}
            label="화살 기도"
          />
          <ListLinkItem href="/musics" icon={<HeadphonesIcon />} label="음악" />
          <ListLinkItem
            href="/downloads"
            icon={<FileDownloadIcon />}
            label="다운로드"
          />
          <ListLinkItem
            href="/blogs/lexio-divina"
            icon={<ArticleIcon />}
            label="블로그"
          />
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
