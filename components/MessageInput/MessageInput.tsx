import SendIcon from '@mui/icons-material/Send';
import { OutlinedInput, OutlinedInputProps, styled } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import { forwardRef } from 'react';

type MessageInputProps = OutlinedInputProps & {
  value: string;
  onSubmit: () => void;
};

const StyledTextField = styled(OutlinedInput)`
  fieldset {
    border-color: ${({ theme }) => theme.palette.divider};
  }
`;

const MessageInput = forwardRef<HTMLTextAreaElement, MessageInputProps>(
  ({ onSubmit, ...props }, ref) => {
    const { value } = props;

    return (
      <Stack gap={1} direction="row" alignItems="center">
        <StyledTextField
          inputRef={ref}
          size="small"
          fullWidth
          multiline
          endAdornment={
            <InputAdornment position="end">
              <IconButton onClick={onSubmit} edge="end">
                <SendIcon
                  fontSize="small"
                  sx={{
                    color: (theme) =>
                      value.length > 0
                        ? theme.palette.primary.main
                        : theme.palette.divider,
                  }}
                />
              </IconButton>
            </InputAdornment>
          }
          {...props}
        />
      </Stack>
    );
  }
);

MessageInput.displayName = 'MessageInput';

export default MessageInput;
