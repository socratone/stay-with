import Button, { ButtonProps } from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import React from 'react';

interface SelectorDialogProps {
  open: boolean;
  onClose: () => void;
  buttons: {
    label: string;
    onClick: () => void;
    color?: ButtonProps['color'];
    variant?: ButtonProps['variant'];
  }[];
  title: string;
  description: string;
}

const SelectorDialog: React.FC<SelectorDialogProps> = ({
  open,
  onClose,
  buttons,
  title,
  description,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
        },
      }}
    >
      <DialogTitle id="alert-dialog-title" sx={{ p: 2 }}>
        {title}
      </DialogTitle>
      <DialogContent sx={{ px: 2, py: 0 }}>
        <DialogContentText id="alert-dialog-description">
          {description}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        {buttons.map((button) => (
          <Button
            key={button.label}
            variant={button.variant ?? 'contained'}
            onClick={button.onClick}
            color={button.color}
          >
            {button.label}
          </Button>
        ))}
      </DialogActions>
    </Dialog>
  );
};

export default SelectorDialog;
