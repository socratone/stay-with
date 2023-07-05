import { SimplePaletteColorOptions } from '@mui/material';

// https://stackoverflow.com/questions/60424596/cant-customize-color-palette-types-on-material-ui-theme-in-typescript
declare module '@mui/material/styles/createPalette' {
  interface Palette {
    paper?: Palette['primary'];
    kakao: SimplePaletteColorOptions;
  }
  interface PaletteOptions {
    paper?: PaletteOptions['primary'];
    kakao: SimplePaletteColorOptions;
  }
}
