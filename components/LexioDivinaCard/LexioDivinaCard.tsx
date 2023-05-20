import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { useTheme } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import SmallMenu from 'components/SmallMenu';
import { Bible, BIBLE_LABEL } from 'constants/bible';
import { isNewTestament } from 'helpers/bible';
import { useState } from 'react';
import { FormattedDate } from 'react-intl';
import { useDebounce } from 'react-use';
import { PRIMARY_SHADOW } from 'theme/shadows';

import BubbleIcon from './BubbleIcon';
import LikedIcon from './LikedIcon';
import OutlinedLikedIcon from './OutlinedLikedIcon';

type LexioDivinaCardProps = {
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
  likeButtonDisabled: boolean;
  onIsLikedSubmit: (isLiked: boolean) => void;
  likedCount: number;
  commentCount: number;
  onCommentButtonClick: () => void;
  onUserClick: () => void;
  createdAt: Date;
};

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
  likeButtonDisabled,
  onIsLikedSubmit,
  likedCount,
  commentCount,
  onCommentButtonClick,
  onUserClick,
  createdAt,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const theme = useTheme();

  const [isTempLiked, setIsTempLiked] = useState(isLiked);

  useDebounce(
    () => {
      if (isLiked !== isTempLiked) {
        onIsLikedSubmit(isTempLiked);
      }
    },
    1000,
    [isTempLiked]
  );

  const handleLikeButtonClick = () => {
    setIsTempLiked((liked) => !liked);
  };

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
      return `${BIBLE_LABEL[bible]} ${chapter},${verse}`;
    }

    if (chapter === endChapter) {
      return `${BIBLE_LABEL[bible]} ${chapter},${verse}-${endVerse}`;
    }

    return `${BIBLE_LABEL[bible]} ${chapter},${verse}-${endChapter},${endVerse}`;
  };

  const getChipColor = () => {
    if (isNewTestament(bible)) {
      return 'primary';
    }
    return 'secondary';
  };

  return (
    <Box
      component="article"
      sx={{
        borderRadius: 6,
        border: 1,
        borderColor: (theme) => theme.palette.divider,
      }}
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
        <Box
          display="flex"
          alignItems="center"
          gap={1}
          sx={{ cursor: 'pointer' }}
          onClick={onUserClick}
        >
          <Avatar
            alt="profile"
            src={profileImageUrl}
            sx={{ width: 34, height: 34 }}
          >
            {name?.[0] ?? 'P'}
          </Avatar>
          <Stack>
            <Typography
              color="text.primary"
              fontWeight={500}
              sx={{ lineHeight: 1.2 }}
            >
              {name}
            </Typography>
            <Typography
              variant="body2"
              color={(theme) => theme.palette.text.secondary}
              sx={{ lineHeight: 1.2 }}
            >
              <FormattedDate value={createdAt} />
            </Typography>
          </Stack>
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
          disabled={likeButtonDisabled}
          onClick={handleLikeButtonClick}
          size="small"
        >
          {isTempLiked ? (
            <LikedIcon color={theme.palette.error.main} />
          ) : (
            <OutlinedLikedIcon color={theme.palette.text.secondary} />
          )}
        </IconButton>
        {likedCount ? (
          <Typography color="text.secondary" fontSize={14}>
            {likedCount}
          </Typography>
        ) : null}
        <IconButton onClick={onCommentButtonClick} size="small">
          <BubbleIcon color={theme.palette.text.secondary} />
        </IconButton>
        {commentCount ? (
          <Typography color="text.secondary" fontSize={14}>
            {commentCount}
          </Typography>
        ) : null}
      </Stack>
    </Box>
  );
};

export default LexioDivinaCard;
