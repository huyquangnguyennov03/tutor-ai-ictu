import React, { useEffect } from 'react';
import { Container, Typography, Box, CssBaseline, ThemeProvider, createTheme, Alert, CircularProgress } from '@mui/material';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store } from '@/redux/store';
import { fetchStudentProgress, selectStatus, selectErrorMessage } from '@/redux/slices/studentProgressSlice';
import StudentInfo from './StudentInfo';
import ChapterProgress from './ChapterProgress';
import SummaryStats from './SummaryStats';
import ErrorAnalysis from './ErrorAnalysis';
import ImprovementSuggestions from './ImprovementSuggestions';
import { AppDispatch } from '@/redux/store'; // Import AppDispatch type

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    error: {
      main: '#f44336',
    },
    warning: {
      main: '#ff9800',
    },
    info: {
      main: '#2196f3',
    },
    success: {
      main: '#4caf50',
    },
  },
});

// Use the correctly typed dispatch
const useAppDispatch = () => useDispatch<AppDispatch>();

// Dashboard component that uses Redux
const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch(); // Use the typed dispatch
  const status = useSelector(selectStatus);
  const errorMessage = useSelector(selectErrorMessage);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchStudentProgress());
    }
  }, [dispatch, status]);

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Bảng Tiến Độ Học Tập
      </Typography>

      {status === 'loading' && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {status === 'failed' && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {errorMessage || 'Đã xảy ra lỗi khi tải dữ liệu'}
        </Alert>
      )}

      {status === 'succeeded' && (
        <>
          <StudentInfo />
          <SummaryStats />
          <ChapterProgress />
          <ErrorAnalysis />
          <ImprovementSuggestions />
        </>
      )}
    </Box>
  );
};

// Main component with Redux Provider
const Index: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Dashboard />
      </ThemeProvider>
    </Provider>
  );
};

export default Index;