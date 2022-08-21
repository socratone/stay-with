import styled from '@emotion/styled';
import { Avatar, Box, IconButton, Typography } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useState } from 'react';
import CirclePagination from './CirclePagination';

interface PostCardProps {
  name: string;
  profileImageUrl?: string;
  phrase: string;
  content: string;
  isLiked: boolean;
}

const StyledPostCard = styled.article``;

const PostCard: React.FC<PostCardProps> = ({
  name,
  profileImageUrl,
  phrase,
  content,
  isLiked,
}) => {
  const [page, setPage] = useState(0);

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

  return (
    <StyledPostCard>
      {/* header */}
      <Box display="flex" alignContent="center" gap={2} px={2} py={1}>
        {profileImageUrl ? (
          <Avatar alt="Profile" src={profileImageUrl} />
        ) : (
          <Avatar sx={{ width: 32, height: 32 }}>{name[0]}</Avatar>
        )}
        <Box display="flex" alignItems="center">
          <Typography>{name}</Typography>
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
        <IconButton>
          <ShareIcon />
        </IconButton>
      </Box>
    </StyledPostCard>
  );
};

export default PostCard;
