import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import Box from '@mui/material/Box';
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
  onEdit?: () => void;
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
    <Stack direction="row" gap={1} flexWrap="wrap">
      <ProfileAvatar src={profileImageUrl} size="2.125rem" />
      <Box>
        <Typography display="flex" gap={1} alignItems="center" flexWrap="wrap">
          <Typography color="text.primary" component="span" fontWeight={600}>
            {name}
          </Typography>
          <Typography component="span" variant="body2" color="text.primary">
            <FormattedDate value={createdAt} />
          </Typography>
        </Typography>
        <Typography
          color="text.secondary"
          align="left"
          whiteSpace="pre-line"
          sx={{ wordBreak: 'break-all' }}
        >
          {message}
        </Typography>
      </Box>
      {isMyself ? (
        <Stack direction="row" ml="auto">
          {onEdit ? (
            <IconButton size="small" onClick={onEdit}>
              <EditIcon fontSize="small" />
            </IconButton>
          ) : null}
          <IconButton size="small" onClick={onDelete}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>
      ) : null}
    </Stack>
  );
};

export default MessageItem;
