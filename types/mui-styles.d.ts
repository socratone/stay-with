import { SimplePaletteColorOptions } from '@mui/material';

declare module '@mui/material/styles' {
  interface Palette {
    paper?: Palette['primary'];
    kakao: SimplePaletteColorOptions;
  }

  interface PaletteOptions {
    paper?: PaletteOptions['primary'];
    kakao: SimplePaletteColorOptions;
  }

  interface TypographyVariants {
    mh1: React.CSSProperties;
    mh2: React.CSSProperties;
    mh3: React.CSSProperties;
    mp: React.CSSProperties;
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    mh1?: React.CSSProperties;
    mh2?: React.CSSProperties;
    mh3?: React.CSSProperties;
    mp?: React.CSSProperties;
  }
}

// Update the Typography's variant prop options
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    mh1: true;
    mh2: true;
    mh3: true;
    mp: true;
  }
}
