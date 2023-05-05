import Button, { ButtonProps } from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import React from 'react';

type AlertDialogProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  title: string;
  description: string;
  color?: ButtonProps['color'];
};

const AlertDialog: React.FC<AlertDialogProps> = ({
  open,
  onClose,
  onSubmit,
  title,
  description,
  color,
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
        <Button variant="outlined" onClick={onClose} color={color}>
          취소
        </Button>
        <Button variant="contained" onClick={onSubmit} autoFocus color={color}>
          확인
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AlertDialog;
