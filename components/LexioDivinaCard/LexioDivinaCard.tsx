import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { useTheme } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import SmallMenu from 'components/SmallMenu';
import { Bible, bibleLabel } from 'constants/bible';
import { useState } from 'react';
import { PRIMARY_SHADOW } from 'theme/shadows';
import { isNewTestament } from 'utils/bible';

import BubbleIcon from './BubbleIcon';
import LikedIcon from './LikedIcon';
import OutlinedLikedIcon from './OutlinedLikedIcon';

interface LexioDivinaCardProps {
  name: string;
  profileImageUrl?: string;
  phrase: string;
  bible: Bible;
  chapter: number;
  verse: number;
  endChapter: number;
  endVerse: number;
  content: string;
  isLiked: boolean;
  isMine: boolean;
  onEditMenuItemClick: () => void;
  onDeleteMenuItemClick: () => void;
  onLikeButtonClick: () => void;
  onUnlikeButtonClick: () => void;
  likedCount: number;
  commentCount: number;
  onCommentButtonClick: () => void;
  onUserClick: () => void;
}

const LexioDivinaCard: React.FC<LexioDivinaCardProps> = ({
  name,
  profileImageUrl,
  phrase,
  bible,
  chapter,
  verse,
  endChapter,
  endVerse,
  content,
  isLiked,
  isMine,
  onEditMenuItemClick,
  onDeleteMenuItemClick,
  onLikeButtonClick,
  onUnlikeButtonClick,
  likedCount,
  commentCount,
  onCommentButtonClick,
  onUserClick,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const theme = useTheme();

  const handleOptionButtonClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleEdit = () => {
    setAnchorEl(null);
    onEditMenuItemClick();
  };

  const handleDelete = () => {
    setAnchorEl(null);
    onDeleteMenuItemClick();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const getChipLabel = () => {
    if (!endChapter && !endVerse) {
      return `${bibleLabel[bible]} ${chapter},${verse}`;
    }

    if (chapter === endChapter) {
      return `${bibleLabel[bible]} ${chapter},${verse}-${endVerse}`;
    }

    return `${bibleLabel[bible]} ${chapter},${verse}-${endChapter},${endVerse}`;
  };

  const getChipColor = () => {
    if (isNewTestament(bible)) {
      return 'primary';
    }
    return 'secondary';
  };

  return (
    <Paper component="article" sx={{ borderRadius: 6 }}>
      {/* header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignContent="center"
        gap={1}
        px={2}
        py={2}
      >
        <Box
          display="flex"
          alignItems="center"
          gap={1}
          sx={{ cursor: 'pointer' }}
          onClick={onUserClick}
        >
          {profileImageUrl ? (
            <Avatar
              alt="Profile"
              src={profileImageUrl}
              sx={{ width: 34, height: 34 }}
            />
          ) : (
            <Avatar sx={{ width: 34, height: 34 }}>{name?.[0] ?? 'P'}</Avatar>
          )}
          <Box display="flex" alignItems="center">
            <Typography color="text.primary" fontWeight={500}>
              {name}
            </Typography>
          </Box>
        </Box>
        <Box display="flex" alignItems="center" gap={1}>
          <Chip label={getChipLabel()} color={getChipColor()} />
          {isMine ? (
            <>
              <IconButton
                onClick={handleOptionButtonClick}
                size="small"
                sx={{ boxShadow: PRIMARY_SHADOW }}
              >
                <MoreHorizIcon />
              </IconButton>
              <SmallMenu anchorEl={anchorEl} open={open} onClose={handleClose}>
                <MenuItem onClick={handleEdit}>수정</MenuItem>
                <MenuItem onClick={handleDelete}>삭제</MenuItem>
              </SmallMenu>
            </>
          ) : null}
        </Box>
      </Box>

      {/* phrase */}
      <Typography
        fontSize={18}
        color="text.primary"
        px={2}
        sx={{ whiteSpace: 'pre-line' }}
        fontWeight={600}
        mb={2}
      >
        {phrase}
      </Typography>

      {/* content */}
      <Typography color="text.secondary" px={2} sx={{ whiteSpace: 'pre-line' }}>
        {content}
      </Typography>

      {/* footer */}
      <Stack direction="row" alignItems="center" p={1}>
        <IconButton
          onClick={isLiked ? onUnlikeButtonClick : onLikeButtonClick}
          size="small"
        >
          {isLiked ? (
            <LikedIcon color={theme.palette.error.main} />
          ) : (
            <OutlinedLikedIcon color={theme.palette.text.secondary} />
          )}
        </IconButton>
        {likedCount ? (
          <Typography fontSize={14}>{likedCount}</Typography>
        ) : null}
        <IconButton onClick={onCommentButtonClick} size="small">
          <BubbleIcon color={theme.palette.text.secondary} />
        </IconButton>
        {commentCount ? (
          <Typography fontSize={14}>{commentCount}</Typography>
        ) : null}
      </Stack>
    </Paper>
  );
};

export default LexioDivinaCard;
