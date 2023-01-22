import { forwardRef, useCallback } from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import { CustomContentProps, SnackbarContent, useSnackbar } from 'notistack';

const Snackbar = forwardRef<HTMLDivElement, CustomContentProps>(
  ({ id, variant, message }, ref) => {
    const { closeSnackbar } = useSnackbar();

    const handleDismiss = useCallback(() => {
      closeSnackbar(id);
    }, [id, closeSnackbar]);

    return (
      <SnackbarContent ref={ref}>
        <Alert
          iconMapping={{
            success: <CheckCircleIcon fontSize="inherit" />,
            error: <ErrorIcon fontSize="inherit" />,
            info: <ErrorIcon fontSize="inherit" />,
            warning: <WarningIcon fontSize="inherit" />,
          }}
          severity={variant === 'default' ? 'success' : variant}
          action={
            <IconButton size="small" onClick={handleDismiss}>
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          {message}
        </Alert>
      </SnackbarContent>
    );
  }
);

Snackbar.displayName = 'Snackbar';

export default Snackbar;
