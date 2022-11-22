import {
  Avatar,
  Box,
  Chip,
  IconButton,
  MenuItem,
  Paper,
  Typography,
} from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useState } from 'react';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Bible, bibleLabel } from '../../libs/firebase/constants';
import SmallMenu from '../SmallMenu';
import { PRIMARY_SHADOW } from '../../theme/shadows';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

interface PostCardProps {
  name: string;
  profileImage?: string;
  phrase: string;
  bible: Bible;
  startedChapter: number;
  startedVerse: number;
  endedChapter?: number;
  endedVerse?: number;
  content: string;
  isLiked: boolean;
  isMine: boolean;
  onEditMenuItemClick: () => void;
  onDeleteMenuItemClick: () => void;
  onLikeButtonClick: () => void;
  onUnlikeButtonClick: () => void;
  likedCount: number;
  onCommentButtonClick: () => void;
}

const PostCard: React.FC<PostCardProps> = ({
  name,
  profileImage,
  phrase,
  bible,
  startedChapter,
  startedVerse,
  endedChapter,
  endedVerse,
  content,
  isLiked,
  isMine,
  onEditMenuItemClick,
  onDeleteMenuItemClick,
  onLikeButtonClick,
  onUnlikeButtonClick,
  likedCount,
  onCommentButtonClick,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
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
    if (!endedChapter && !endedVerse) {
      return `${bibleLabel[bible]} ${startedChapter},${startedVerse}`;
    }

    if (startedChapter === endedChapter) {
      return `${bibleLabel[bible]} ${startedChapter},${startedVerse}-${endedVerse}`;
    }

    return `${bibleLabel[bible]} ${startedChapter},${startedVerse}-${endedChapter},${endedVerse}`;
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
        <Box display="flex" alignItems="center" gap={1}>
          {profileImage ? (
            <Avatar alt="Profile" src={profileImage} />
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
          <Chip label={getChipLabel()} color="primary" />
          {isMine ? (
            <>
              <IconButton
                onClick={handleClick}
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
      <Box display="flex" alignItems="center" p={1}>
        <IconButton onClick={isLiked ? onUnlikeButtonClick : onLikeButtonClick}>
          {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>
        {likedCount ? (
          <Typography fontSize={14}>{likedCount}</Typography>
        ) : null}
        <IconButton onClick={onCommentButtonClick}>
          <ChatBubbleOutlineIcon />
        </IconButton>
      </Box>
    </Paper>
  );
};

export default PostCard;
