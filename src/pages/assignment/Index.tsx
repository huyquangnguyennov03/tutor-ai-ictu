// src/pages/assignment/Index.tsx
import React from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import AssignmentManagement from './AssignmentManagement';

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f7fa',
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      'Helvetica Neue',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

const Index: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AssignmentManagement />
    </ThemeProvider>
  );
};

export default Index;