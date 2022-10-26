import {
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useState } from 'react';
import CirclePagination from './CirclePagination';
import MoreVertIcon from '@mui/icons-material/MoreVert';

interface PostCardProps {
  name: string;
  profileImageUrl?: string;
  phrase: string;
  content: string;
  isLiked: boolean;
  onEdit: () => void;
}

const ITEM_HEIGHT = 48;

const PostCard: React.FC<PostCardProps> = ({
  name,
  profileImageUrl,
  phrase,
  content,
  isLiked,
  onEdit,
}) => {
  const [page, setPage] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const getPartialContents = (content: string) => {
    const contents = [];

    while (content.length > 0) {
      const partialContent = content.substring(0, 500);
      contents.push(partialContent);
      content = content.substring(500);
    }

    return contents;
  };

  const partialContents = getPartialContents(content);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleEdit = () => {
    setAnchorEl(null);
    onEdit();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box component="article">
      {/* header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignContent="center"
        gap={1}
        px={2}
        py={1}
      >
        <Box display="flex" alignItems="center" gap={1}>
          {profileImageUrl ? (
            <Avatar alt="Profile" src={profileImageUrl} />
          ) : (
            <Avatar sx={{ width: 32, height: 32 }}>{name[0]}</Avatar>
          )}
          <Box display="flex" alignItems="center">
            <Typography>{name}</Typography>
          </Box>
        </Box>
        <Box display="flex" alignItems="center">
          <IconButton onClick={handleClick} sx={{ m: -1 }}>
            <MoreVertIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            PaperProps={{
              style: {
                maxHeight: ITEM_HEIGHT * 4.5,
                width: '20ch',
              },
            }}
          >
            <MenuItem onClick={handleEdit}>수정</MenuItem>
          </Menu>
        </Box>
      </Box>

      {/* phrase */}
      <Box px={2} bgcolor="paper.main" p={2}>
        {phrase}
      </Box>

      {/* content */}
      <Box>
        <Swiper
          slidesPerView={1}
          onSlideChange={(swiper) => setPage(swiper.activeIndex)}
          tabIndex={1}
        >
          {partialContents.map((partialContent, index) => (
            <SwiperSlide key={index}>
              <Box px={2} pt={2} pb={1}>
                <Typography sx={{ whiteSpace: 'pre-line' }}>
                  {partialContent}
                </Typography>
              </Box>
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>

      {/* footer */}
      <Box display="flex" justifyContent="space-between" px={1}>
        <IconButton>
          {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>
        <CirclePagination page={page} length={partialContents.length} />
      </Box>
    </Box>
  );
};

export default PostCard;
