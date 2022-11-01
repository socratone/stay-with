import {
  Avatar,
  Box,
  Chip,
  IconButton,
  MenuItem,
  Paper,
  Typography,
  useTheme,
} from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useState } from 'react';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { PRIMARY_BOX_SHADOW } from '../../theme/boxShadow';
import { Bible, bibleLabel } from '../../libs/firebase/constants';
import SmallMenu from '../SmallMenu';

interface PostCardProps {
  nickname: string;
  profileImageUrl?: string;
  phrase: string;
  bible: Bible;
  started: string;
  content: string;
  isLiked: boolean;
  isMine: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

const PostCard: React.FC<PostCardProps> = ({
  nickname,
  profileImageUrl,
  phrase,
  bible,
  started,
  content,
  isLiked,
  isMine,
  onEdit,
  onDelete,
}) => {
  const theme = useTheme();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleEdit = () => {
    setAnchorEl(null);
    onEdit();
  };

  const handleDelete = () => {
    setAnchorEl(null);
    onDelete();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Paper
      component="article"
      sx={{ borderRadius: 6, boxShadow: PRIMARY_BOX_SHADOW }}
    >
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
          {profileImageUrl ? (
            <Avatar alt="Profile" src={profileImageUrl} />
          ) : (
            <Avatar sx={{ width: 34, height: 34 }}>{nickname[0]}</Avatar>
          )}
          <Box display="flex" alignItems="center">
            <Typography fontWeight={500} color={theme.palette.grey[900]}>
              {nickname}
            </Typography>
          </Box>
        </Box>
        <Box display="flex" alignItems="center" gap={1}>
          <Chip label={`${bibleLabel[bible]} ${started}`} color="primary" />
          {isMine ? (
            <>
              <IconButton
                onClick={handleClick}
                size="small"
                sx={{ boxShadow: PRIMARY_BOX_SHADOW }}
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
        color={theme.palette.grey[900]}
        px={2}
        sx={{ whiteSpace: 'pre-line' }}
        fontWeight={600}
        mb={2}
      >
        {phrase}
      </Typography>

      {/* content */}
      <Typography
        color={theme.palette.grey[600]}
        px={2}
        sx={{ whiteSpace: 'pre-line' }}
      >
        {content}
      </Typography>

      {/* footer */}
      <Box display="flex" justifyContent="space-between" p={1}>
        <IconButton>
          {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>
      </Box>
    </Paper>
  );
};

export default PostCard;
