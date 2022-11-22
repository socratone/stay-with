import { Avatar, Box, ButtonBase, Typography, useTheme } from '@mui/material';

interface CommentItemProps {
  image?: string;
  name: string;
  message: string;
  onClick: () => void;
  isSelected: boolean;
}

const CommentItem: React.FC<CommentItemProps> = ({
  image,
  name,
  message,
  onClick,
  isSelected,
}) => {
  const theme = useTheme();

  return (
    <ButtonBase
      onClick={onClick}
      sx={{ bgcolor: isSelected ? theme.palette.primary.main : undefined }}
    >
      <Box
        display="flex"
        alignItems="center"
        gap={1}
        px={2}
        py={1}
        width="100%"
      >
        {image ? (
          <Avatar alt="Profile" src={image} />
        ) : (
          <Avatar sx={{ width: 34, height: 34 }}>{name?.[0] ?? 'P'}</Avatar>
        )}
        <Typography>{message}</Typography>
      </Box>
    </ButtonBase>
  );
};

export default CommentItem;
