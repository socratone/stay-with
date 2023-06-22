import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ProfileAvatar from 'components/ProfileAvatar/ProfileAvatar';
import { FormattedDate } from 'react-intl';

type MessageItemProps = {
  profileImageUrl?: string;
  message: string;
  name: string;
  createdAt: Date;
  isMyself: boolean;
  onEdit: () => void;
  onDelete: () => void;
};

const MessageItem: React.FC<MessageItemProps> = ({
  profileImageUrl,
  message,
  name,
  createdAt,
  isMyself,
  onEdit,
  onDelete,
}) => {
  return (
    <Container>
      <Stack direction="row" gap={1} flexWrap="wrap">
        <ProfileAvatar src={profileImageUrl} size="2.125rem" />
        <Box>
          <Typography display="flex" gap={1} alignItems="center">
            <Typography color="text.primary" component="span" fontWeight={600}>
              {name}
            </Typography>
            <Typography component="span" variant="body2" color="text.primary">
              <FormattedDate value={createdAt} />
            </Typography>
          </Typography>
          <Typography color="text.secondary" align="left" whiteSpace="pre-line">
            {message}
          </Typography>
        </Box>
        {isMyself ? (
          <Stack direction="row" ml="auto">
            <IconButton size="small" onClick={onEdit}>
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" onClick={onDelete}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Stack>
        ) : null}
      </Stack>
    </Container>
  );
};

export default MessageItem;
