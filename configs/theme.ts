import { createTheme } from '@mui/material';

// https://stackoverflow.com/questions/60424596/cant-customize-color-palette-types-on-material-ui-theme-in-typescript
declare module '@mui/material/styles/createPalette' {
  interface Palette {
    paper?: Palette['primary'];
  }
  interface PaletteOptions {
    paper?: PaletteOptions['primary'];
  }
}

const theme = createTheme({
  palette: {
    paper: {
      main: 'rgb(255, 249, 238)',
    },
  },
});

export default theme;
