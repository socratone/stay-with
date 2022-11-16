import { TextField, TextFieldProps } from '@mui/material';
import React from 'react';

const FilledTextField: React.FC<
  Omit<TextFieldProps, 'variant' | 'size' | 'InputProps' | 'error'>
> = ({ ...restProps }) => {
  return (
    <TextField
      {...restProps}
      variant="filled"
      size="small"
      sx={{
        '.MuiInputBase-root': {
          borderRadius: 4,
          p: 2,
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
};

export default FilledTextField;
