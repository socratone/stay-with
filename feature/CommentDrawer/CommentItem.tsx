import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import ProfileAvatar from 'components/ProfileAvatar';
import { FormattedDate } from 'react-intl';

type CommentItemProps = {
  imageUrl?: string;
  name: string;
  message: string;
  createdAt: Date;
  onClick: () => void;
  isSelected: boolean;
};

const CommentItem: React.FC<CommentItemProps> = ({
  imageUrl,
  name,
  message,
  createdAt,
  onClick,
  isSelected,
}) => {
  return (
    <ButtonBase
      onClick={onClick}
      sx={{
        bgcolor: (theme) =>
          isSelected ? theme.palette.action.selected : undefined,
      }}
    >
      <Box display="flex" gap={1} px={2} py={1} width="100%">
        <ProfileAvatar src={imageUrl} size="2.125rem" />
        <Box>
          <Typography display="flex" gap={1} alignItems="center">
            <Typography component="span" fontWeight={600}>
              {name}
            </Typography>
            <Typography
              component="span"
              variant="body2"
              color={(theme) => theme.palette.text.secondary}
            >
              <FormattedDate value={createdAt} />
            </Typography>
          </Typography>
          <Typography align="left">{message}</Typography>
        </Box>
      </Box>
    </ButtonBase>
  );
};

export default CommentItem;
