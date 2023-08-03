import { SxProps } from '@mui/material';
import Chip from '@mui/material/Chip';
import { useRouter } from 'next/router';
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
  const router = useRouter();

  const [show, setShow] = useState(true);

  const handleMove = () => {
    router.push('/dev');
  };

  const handleDelete = () => {
    setShow(false);
  };

  if (!show) {
    return null;
  }

  switch (env) {
    case 'development':
      return (
        <Chip
          label="Dev"
          color="success"
          onClick={handleMove}
          onDelete={handleDelete}
          sx={sx}
        />
      );

    case 'staging':
      return (
        <Chip
          label="Stag"
          color="warning"
          onClick={handleDelete}
          onDelete={handleDelete}
          sx={sx}
        />
      );

    case 'production':
    default:
      return null;
  }
};

export default EnvChip;
