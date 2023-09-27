import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { SxProps } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import * as React from 'react';

type DarkModeSwitchProps = {
  checked: boolean;
  disabled?: boolean;
  onClick: () => void;
  sx?: SxProps;
};

const DarkModeSwitch: React.FC<DarkModeSwitchProps> = ({
  checked,
  disabled,
  onClick,
  sx,
}) => {
  return (
    <IconButton size="small" disabled={disabled} onClick={onClick} sx={sx}>
      {checked ? (
        <DarkModeIcon aria-label="Dark mode" />
      ) : (
        <LightModeIcon aria-label="Light mode" />
      )}
    </IconButton>
  );
};

export default DarkModeSwitch;
