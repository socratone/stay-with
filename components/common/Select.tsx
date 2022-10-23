import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import MuiSelect, { SelectChangeEvent } from '@mui/material/Select';
import { styled } from '@mui/material/styles';

interface SelectProps {
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  options: {
    value: string;
    label: string;
  }[];
}

// TODO: theme 색상 조절
const StyledMenuItem = styled(MenuItem)<{ isSelected: boolean }>((props) => ({
  backgroundColor: props.isSelected
    ? `${props.theme.palette.primary.main} !important`
    : undefined,
  ':hover': {
    backgroundColor: `${props.theme.palette.primary.dark} !important`,
  },
}));

const Select: React.FC<SelectProps> = ({
  value,
  placeholder = '',
  onChange,
  options,
}) => {
  const handleChange = (event: SelectChangeEvent<string>) => {
    onChange(event.target.value);
  };

  return (
    <MuiSelect
      value={value}
      onChange={handleChange}
      renderValue={(value) => {
        if (!value) {
          return placeholder;
        }
        return options.find((option) => option.value === value)?.label;
      }}
      fullWidth
      size="small"
    >
      {options.map((option) => (
        <StyledMenuItem
          key={option.value}
          value={option.value}
          isSelected={option.value === value}
        >
          {option.label}
        </StyledMenuItem>
      ))}
    </MuiSelect>
  );
};

export default Select;
