import { SxProps } from '@mui/material';
import Chip from '@mui/material/Chip';
import { useState } from 'react';

const env = process.env.NEXT_PUBLIC_ENV;

const sx = {
  opacity: 0.5,
  cursor: 'pointer',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
} satisfies SxProps;

const EnvChip = () => {
  const [show, setShow] = useState(true);

  const handleClick = () => {
    setShow(false);
  };

  if (!show) {
    return null;
  }

  switch (env) {
    case 'development':
      return <Chip label="Dev" color="success" onClick={handleClick} sx={sx} />;

    case 'staging':
      return (
        <Chip label="Stag" color="warning" onClick={handleClick} sx={sx} />
      );

    case 'production':
    default:
      return null;
  }
};

export default EnvChip;
