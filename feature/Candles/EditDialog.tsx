import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import useArrow from 'hooks/api/useArrow';
import React, { useEffect, useState } from 'react';

type EditDialogProps = {
  id?: string;
  open: boolean;
  title: string;
  onClose: () => void;
  onSubmit: (message: string) => void;
};

const EditDialog: React.FC<EditDialogProps> = ({
  id,
  open,
  title,
  onClose,
  onSubmit,
}) => {
  const [message, setMessage] = useState('');

  const { data: arrowData } = useArrow(id);

  useEffect(() => {
    if (arrowData) {
      setMessage(arrowData.arrow.message);
    }
  }, [arrowData]);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
  };

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
        <TextField
          size="small"
          multiline
          fullWidth
          value={message}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button variant="outlined" onClick={onClose}>
          취소
        </Button>
        <Button variant="contained" onClick={() => onSubmit(message)} autoFocus>
          수정
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditDialog;
