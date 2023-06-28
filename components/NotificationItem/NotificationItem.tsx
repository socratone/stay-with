import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ProfileAvatar from 'components/ProfileAvatar';
import { NotificationType } from 'schemas';

type NotificationItemProps = {
  type: NotificationType;
  users: {
    name: string;
    imageUrl?: string;
  }[];
  message?: string;
  newed?: boolean;
};

const NotificationItem: React.FC<NotificationItemProps> = ({
  type,
  users,
  message,
  newed,
}) => {
  switch (type) {
    case NotificationType.LexioDivinaComment:
      return (
        <Stack direction="row" gap="1rem">
          <ProfileAvatar src={users[0].imageUrl} size="3rem" />
          <Stack>
            <Typography color="text.primary">{users[0].name}이</Typography>
            <Typography>{message}</Typography>
            {newed ? <Typography color="error">New</Typography> : null}
          </Stack>
        </Stack>
      );

    case NotificationType.LexioDivinaLiked:
      return (
        <Stack direction="row" gap="1rem">
          <ProfileAvatar src={users[0].imageUrl} size="3rem" />
          <Stack>
            <Typography color="text.primary">{users[0].name}이</Typography>
            <Typography>{message}</Typography>
          </Stack>
        </Stack>
      );
  }
};

export default NotificationItem;
