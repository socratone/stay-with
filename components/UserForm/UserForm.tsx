import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { SubmitHandler, UseFormReturn } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl';

export type UserFormValues = {
  name: string;
};

type UserFormProps = {
  form: UseFormReturn<UserFormValues>;
  isRequested: boolean;
  onSubmit: SubmitHandler<UserFormValues>;
  onCancel: () => void;
};

const UserForm: React.FC<UserFormProps> = ({
  form,
  isRequested,
  onSubmit,
  onCancel,
}) => {
  const { formatMessage } = useIntl();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <Box
      component="form"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
      }}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Stack direction="row" gap={1} alignItems="center">
        <TextField
          {...register('name', {
            required: true,
            maxLength: 20,
          })}
          size="small"
          placeholder={formatMessage({ id: 'common.name' })}
          error={!!errors.name}
        />
        <Button
          variant="contained"
          size="small"
          type="submit"
          disabled={isRequested}
        >
          <FormattedMessage id="common.save" />
        </Button>
        <Button variant="outlined" size="small" onClick={onCancel}>
          <FormattedMessage id="common.cancel" />
        </Button>
      </Stack>
    </Box>
  );
};

export default UserForm;
