import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

interface AlertDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  title: string;
  description: string;
}

const AlertDialog: React.FC<AlertDialogProps> = ({
  open,
  onClose,
  onSubmit,
  title,
  description,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {description}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          취소
        </Button>
        <Button variant="contained" onClick={onSubmit} autoFocus>
          확인
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AlertDialog;
