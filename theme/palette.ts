import { PaletteOptions } from '@mui/material';
import { grey } from '@mui/material/colors';

export const lightPalette: PaletteOptions = {
  paper: {
    main: '#fff',
  },
  text: {
    primary: grey[900],
    secondary: grey[600],
  },
};

export const darkPalette: PaletteOptions = {
  paper: {
    main: grey[900],
  },
  text: {
    primary: grey[300],
    secondary: grey[400],
  },
};
