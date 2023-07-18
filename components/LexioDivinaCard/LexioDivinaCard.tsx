import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ShareIcon from '@mui/icons-material/Share';
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
import { motion } from 'framer-motion';
import { isNewTestament } from 'helpers/bible';
import Link from 'next/link';
import { useState } from 'react';
import { FormattedDate } from 'react-intl';
import { useDebounce } from 'react-use';
import { PRIMARY_SHADOW } from 'theme/shadows';
import { popUpItem } from 'utils/animation';

import BubbleIcon from './BubbleIcon';
import LikedIcon from './LikedIcon';
import OutlinedLikedIcon from './OutlinedLikedIcon';

type LexioDivinaCardProps = {
  /** 이름 */
  name: string;
  /** 프로필 이미지 url */
  profileImageUrl?: string;
  /** 성서 구절 */
  phrase: string;
  /** 성서 책 */
  bible: Bible;
  /** 장 */
  chapter: number;
  /** 절 */
  verse: number;
  /** 끝나는 장 */
  endChapter?: number;
  /** 끝나는 절 */
  endVerse?: number;
  /** 묵상 내용 */
  content: string;
  /** 더 보기 링크 */
  moreHref?: string;
  /** 최대 묵상 내용 글자 수 */
  maxContentLength?: number;
  /** 사용자가 좋아요를 누른 경우 */
  isLiked: boolean;
  /** 사용자의 글인 경우 */
  isMine: boolean;
  /** 수정 메뉴 클릭 이벤트 */
  onEditMenuItemClick: () => void;
  /** 삭제 메뉴 클릭 이벤트 */
  onDeleteMenuItemClick: () => void;
  /** 좋아요 버튼 비활성 */
  likeButtonDisabled?: boolean;
  /** 디바운스된 like 변경 요청 */
  onIsLikedSubmit: (isLiked: boolean) => void;
  /** 좋아요 수 */
  likedCount: number;
  /** 댓글 수 */
  commentCount?: number;
  /** 댓글 버튼 클릭 이벤트 */
  onCommentButtonClick: () => void;
  /** 작성자 클릭 이벤트 */
  onUserClick: () => void;
  /** 공유 버튼 클릭 이벤트 */
  onShareButtonClick?: () => void;
  /** 작성 날짜 */
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
  moreHref,
  maxContentLength,
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
  onShareButtonClick,
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
      component={motion.article}
      {...popUpItem}
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
      {maxContentLength ? (
        <Typography
          color="text.secondary"
          px={2}
          sx={{ whiteSpace: 'pre-line' }}
        >
          {content.length > maxContentLength ? (
            <>
              {content.substring(0, maxContentLength + 1) + '... '}
              {moreHref ? (
                <Link href={moreHref}>
                  <Typography
                    component="span"
                    color="text.primary"
                    fontWeight={500}
                  >
                    더 보기
                  </Typography>
                </Link>
              ) : null}
            </>
          ) : (
            content
          )}
        </Typography>
      ) : (
        <Typography
          color="text.secondary"
          px={2}
          sx={{ whiteSpace: 'pre-line' }}
        >
          {content}
        </Typography>
      )}

      {/* footer */}
      <Stack direction="row" alignItems="center" p={1}>
        <IconButton
          disabled={likeButtonDisabled}
          size="small"
          onClick={handleLikeButtonClick}
          sx={footerIconSx}
        >
          {isTempLiked ? (
            <LikedIcon
              color={
                likeButtonDisabled
                  ? theme.palette.action.disabled
                  : theme.palette.error.main
              }
            />
          ) : (
            <OutlinedLikedIcon
              color={
                likeButtonDisabled
                  ? theme.palette.action.disabled
                  : theme.palette.text.secondary
              }
            />
          )}
        </IconButton>
        {likedCount ? (
          <Typography color="text.secondary" variant="body2">
            {likedCount}
          </Typography>
        ) : null}
        <IconButton
          size="small"
          onClick={onCommentButtonClick}
          sx={footerIconSx}
        >
          <BubbleIcon color={theme.palette.text.secondary} />
        </IconButton>
        {commentCount ? (
          <Typography color="text.secondary" variant="body2">
            {commentCount}
          </Typography>
        ) : null}
        {onShareButtonClick ? (
          <IconButton
            size="small"
            onClick={onShareButtonClick}
            sx={{ ml: 'auto' }}
          >
            <ShareIcon
              sx={{
                color: theme.palette.text.secondary,
                fontSize: '1.65rem',
              }}
            />
          </IconButton>
        ) : null}
      </Stack>
    </Box>
  );
};

export default LexioDivinaCard;
