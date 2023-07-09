import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useQueryClient } from '@tanstack/react-query';
import ProfileAvatar from 'components/ProfileAvatar';
import { patchNotification } from 'helpers/axios';
import { NOTIFICATIONS_QUERY_KEY } from 'hooks/api/useNotifications';
import { NOTIFICATIONS_COUNT_QUERY_KEY } from 'hooks/api/useNotificationsCount';
import { useRouter } from 'next/router';
import React from 'react';
import { NotificationType } from 'schemas';

type NotificationItemProps = {
  id: string;
  type: NotificationType;
  user: {
    name: string;
    imageUrl?: string;
  };
  message?: string;
  isNew?: boolean;
  lexioDivinaId?: string;
};

const NotificationItem: React.FC<NotificationItemProps> = ({
  id,
  type,
  user,
  message,
  isNew,
  lexioDivinaId,
}) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const reset = () => {
    queryClient.invalidateQueries({ queryKey: [NOTIFICATIONS_QUERY_KEY] });
    queryClient.invalidateQueries({
      queryKey: [NOTIFICATIONS_COUNT_QUERY_KEY],
    });
  };

  const handleItemClick = async (isNew?: boolean) => {
    if (!lexioDivinaId) return; // prevent exception
    router.push(`/?comments=${lexioDivinaId}`);
    if (!isNew) return;
    try {
      await patchNotification(id, { isNew: false });
    } catch {
      //
    }
  };

  const handleNewChipClick = async (
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    event.stopPropagation();
    try {
      await patchNotification(id, { isNew: false });
      reset();
    } catch {
      //
    }
  };

  switch (type) {
    case NotificationType.LexioDivinaComment:
      return (
        <Stack
          direction="row"
          gap={1}
          onClick={() => handleItemClick(isNew)}
          sx={{
            cursor: 'pointer',
          }}
        >
          <ProfileAvatar src={user.imageUrl} size="3rem" />
          <Stack>
            <Typography color="text.primary">
              {user.name}님이 댓글을 남겼습니다.
            </Typography>
            <Typography color="text.primary">{message}</Typography>
          </Stack>
          {isNew ? (
            <Box display="flex" alignItems="center">
              <Chip
                color="error"
                label="NEW"
                size="small"
                onClick={handleNewChipClick}
                onDelete={handleNewChipClick}
              />
            </Box>
          ) : null}
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
