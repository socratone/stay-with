import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { SxProps, useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ProfileAvatar from 'components/ProfileAvatar/ProfileAvatar';
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
  endChapter?: number;
  endVerse?: number;
  content: string;
  isLiked: boolean;
  isMine: boolean;
  onEditMenuItemClick: () => void;
  onDeleteMenuItemClick: () => void;
  likeButtonDisabled: boolean;
  onIsLikedSubmit: (isLiked: boolean) => void;
  likedCount: number;
  commentCount?: number;
  onCommentButtonClick: () => void;
  onUserClick: () => void;
  createdAt: Date;
};

const footerIconSx: SxProps = { svg: { width: '1.5rem', height: '1.5rem' } };

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
    if (!endChapter || !endVerse) {
      return `${BIBLE_LABEL[bible]} ${chapter},${verse}`;
    }

    if (chapter === endChapter) {
      return `${BIBLE_LABEL[bible]} ${chapter},${verse}-${endVerse}`;
    }

    return `${BIBLE_LABEL[bible]} ${chapter},${verse}-${endChapter},${endVerse}`;
  };

  const getChipColor = () => {
    if (isNewTestament(bible)) {
      return 'info';
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
        alignItems="center"
        flexWrap="wrap"
        gap={1}
        px={2}
        py={2}
      >
        <Stack
          direction="row"
          alignItems="center"
          gap={1}
          sx={{ cursor: 'pointer' }}
          onClick={onUserClick}
        >
          <ProfileAvatar src={profileImageUrl} size="2.125rem" />
          <Stack>
            <Typography
              variant="body2"
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
        </Stack>
        <Stack direction="row" alignItems="center" gap={1}>
          <Chip
            label={getChipLabel()}
            color={getChipColor()}
            sx={{ height: '2rem', borderRadius: '1rem' }}
          />
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
        </Stack>
      </Box>

      {/* phrase */}
      <Typography
        component="p"
        fontSize="1.125rem" // 18px
        color="text.primary"
        px={2}
        sx={{ whiteSpace: 'pre-line' }}
        fontWeight={600}
        mb={1}
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
          sx={footerIconSx}
        >
          {isTempLiked ? (
            <LikedIcon color={theme.palette.error.main} />
          ) : (
            <OutlinedLikedIcon color={theme.palette.text.secondary} />
          )}
        </IconButton>
        {likedCount ? (
          <Typography color="text.secondary" variant="body2">
            {likedCount}
          </Typography>
        ) : null}
        <IconButton
          onClick={onCommentButtonClick}
          size="small"
          sx={footerIconSx}
        >
          <BubbleIcon color={theme.palette.text.secondary} />
        </IconButton>
        {commentCount ? (
          <Typography color="text.secondary" variant="body2">
            {commentCount}
          </Typography>
        ) : null}
      </Stack>
    </Box>
  );
};

export default LexioDivinaCard;
