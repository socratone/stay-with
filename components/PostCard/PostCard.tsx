import styled from '@emotion/styled';
import { Avatar, Box, Typography } from '@mui/material';

interface PostCardProps {
  name: string;
  profileImageUrl?: string;
  phrase: string;
  content: string;
}

const StyledPostCard = styled.article``;

const PostCard: React.FC<PostCardProps> = ({
  name,
  profileImageUrl,
  phrase,
  content,
}) => {
  return (
    <StyledPostCard>
      <Box display="flex" flexDirection="column" gap={2} p={2}>
        {/* header */}
        <Box display="flex" alignContent="center" gap={2}>
          {profileImageUrl ? (
            <Avatar alt="Profile" src={profileImageUrl} />
          ) : (
            <Avatar>{name[0]}</Avatar>
          )}
          <Box display="flex" alignItems="center">
            <Typography>{name}</Typography>
          </Box>
        </Box>
        {/* phrase */}
        <Box>{phrase}</Box>
        {/* content */}
        <Box>
          <Typography sx={{ whiteSpace: 'pre-line' }}>{content}</Typography>
        </Box>
      </Box>
    </StyledPostCard>
  );
};

export default PostCard;
