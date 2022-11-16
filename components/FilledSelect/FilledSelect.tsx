import { Select, SelectProps } from '@mui/material';
import React from 'react';

const FilledSelect: React.FC<
  Omit<SelectProps, 'variant' | 'size' | 'error' | 'disableUnderline'>
> = ({ ...restProps }) => {
  return (
    <Select
      {...restProps}
      variant="filled"
      sx={{
        borderRadius: 4,
        '.MuiSelect-select': {
          borderRadius: 4,
          py: 2,
          pl: 2,
        },
      }}
      disableUnderline
    />
  );
};

export default FilledSelect;
