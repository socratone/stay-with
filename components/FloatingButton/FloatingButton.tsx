import IconButton from '@mui/material/IconButton';
import React from 'react';

type FloatingButtonProps = {
  hidden?: boolean;
  icon: React.ReactNode;
  onClick: () => void;
};

const FloatingButton: React.FC<FloatingButtonProps> = ({
  hidden,
  icon,
  onClick,
}) => {
  return (
    <IconButton
      onClick={onClick}
      size="large"
      sx={{
        position: 'fixed',
        zIndex: 10,
        bgcolor: (theme) => theme.palette.primary.main,
        bottom: (theme) => theme.spacing(2),
        right: (theme) => theme.spacing(2),
        color: (theme) => theme.palette.primary.contrastText,
        transform: (theme) =>
          `scale(${hidden ? 0 : 1}) translateY(${
            hidden ? theme.spacing(8) : 0
          })`,
        opacity: hidden ? 0 : 1,
        transition: 'all .3s ease',
        boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
      }}
    >
      {icon}
    </IconButton>
  );
};

export default FloatingButton;
