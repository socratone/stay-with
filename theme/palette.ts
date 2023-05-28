import { PaletteOptions } from '@mui/material';
import { grey } from '@mui/material/colors';

export const lightPalette: PaletteOptions = {
  background: {
    default: 'var(--background-color)',
  },
  text: {
    primary: grey[900],
    secondary: grey[600],
  },
};

export const darkPalette: PaletteOptions = {
  background: {
    default: 'var(--background-color)',
  },
  text: {
    primary: grey[300],
    secondary: grey[400],
  },
};
