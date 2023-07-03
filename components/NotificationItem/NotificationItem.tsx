import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ProfileAvatar from 'components/ProfileAvatar';
import { NotificationType } from 'schemas';

type NotificationItemProps = {
  type: NotificationType;
  user: {
    name: string;
    imageUrl?: string;
  };
  message?: string;
  isNew?: boolean;
};

const NotificationItem: React.FC<NotificationItemProps> = ({
  type,
  user,
  message,
  isNew,
}) => {
  switch (type) {
    case NotificationType.LexioDivinaComment:
      return (
        <Stack direction="row" gap={1}>
          <ProfileAvatar src={user.imageUrl} size="3rem" />
          <Stack>
            <Typography color="text.primary">{user.name}이</Typography>
            <Typography color="text.primary">
              {message}라는 댓글을 달았습니다.
            </Typography>
            {isNew ? <Typography color="error">New</Typography> : null}
          </Stack>
        </Stack>
      );

    // TODO: 미개발
    case NotificationType.LexioDivinaLiked:
      return (
        <Stack direction="row" gap={1}>
          <ProfileAvatar src={user.imageUrl} size="3rem" />
          <Stack>
            <Typography color="text.primary">{user.name}이</Typography>
            <Typography>{message}</Typography>
          </Stack>
        </Stack>
      );
  }
};

export default NotificationItem;
