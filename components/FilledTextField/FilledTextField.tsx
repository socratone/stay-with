import { TextField, TextFieldProps } from '@mui/material';
import React from 'react';

const FilledTextField: React.FC<
  Omit<TextFieldProps, 'variant' | 'size' | 'InputProps' | 'error'>
> = React.forwardRef(({ ...restProps }, ref) => {
  return (
    <TextField
      {...restProps}
      ref={ref}
      variant="filled"
      size="small"
      sx={{
        '.MuiInputBase-root': {
          borderRadius: 2,
          p: 1.5,
        },
        '.MuiInputBase-input': {
          p: 0,
        },
      }}
      InputProps={{
        disableUnderline: true,
      }}
    />
  );
});

FilledTextField.displayName = 'FilledTextField';

export default FilledTextField;
