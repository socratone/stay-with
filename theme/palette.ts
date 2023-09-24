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
  kakao: { main: '#fee502', contrastText: '#1a1a1c' },
  primary: {
    main: '#ff9903',
    contrastText: '#fff',
  },
  action: {
    /** default는 opacity가 포함 된다. */
    disabled: '#bdbdbd',
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
  kakao: { main: '#f2d00f', contrastText: '#1a1a1c' },
  primary: {
    main: '#ff9903',
  },
  action: {
    /** default는 opacity가 포함 된다. */
    disabled: '#4d4d4d',
  },
};
