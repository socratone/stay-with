import { Select, SelectProps } from '@mui/material';
import React from 'react';

const FilledSelect: React.FC<
  Omit<SelectProps, 'variant' | 'size' | 'error' | 'disableUnderline'>
> = React.forwardRef(({ ...restProps }, ref) => {
  return (
    <Select
      {...restProps}
      ref={ref}
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
});

FilledSelect.displayName = 'FilledSelect';

export default FilledSelect;
