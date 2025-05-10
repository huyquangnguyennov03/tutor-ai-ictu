// theme.d.ts
import '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Theme {
    customShadows: {
      z1: string;
      // Add any other custom shadow properties you need here
    };
  }
  interface ThemeOptions {
    customShadows?: {
      z1?: string;
      // Define any other custom shadow options here
    };
  }
}
