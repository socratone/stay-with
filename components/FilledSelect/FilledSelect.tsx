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
        borderRadius: 2,
        overflow: 'hidden',
        '.MuiSelect-select': {
          p: 1.5,
        },
      }}
      disableUnderline
    />
  );
});

FilledSelect.displayName = 'FilledSelect';

export default FilledSelect;
