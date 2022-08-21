import styled from '@emotion/styled';
import { Avatar, Box, IconButton, Typography, useTheme } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';

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
      <Box px={2} pt={2} pb={1}>
        <Typography sx={{ whiteSpace: 'pre-line' }}>{content}</Typography>
      </Box>

      {/* footer */}
      <Box px={1}>
        <IconButton size="small">
          {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>
      </Box>
    </StyledPostCard>
  );
};

export default PostCard;
