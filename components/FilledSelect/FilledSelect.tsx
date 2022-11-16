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
        overflow: 'hidden',
        '.MuiSelect-select': {
          py: 2,
          pl: 2,
        },
      }}
      disableUnderline
    />
  );
};

export default FilledSelect;
