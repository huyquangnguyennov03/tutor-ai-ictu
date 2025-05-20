import React, { useEffect } from 'react';
import { Container, Typography, Box, CssBaseline, ThemeProvider, createTheme, Alert, CircularProgress, IconButton } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStudentProgress, selectStatus, selectErrorMessage } from '@/redux/slices/studentProgressSlice';
import StudentInfo from './StudentInfo';
import ChapterProgress from './ChapterProgress';
import SummaryStats from './SummaryStats';
import ErrorAnalysis from './ErrorAnalysis';
import ImprovementSuggestions from './ImprovementSuggestions';
import { AppDispatch } from '@/redux/store';
import { useParams, useNavigate } from 'react-router-dom';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useAppSelector } from '@/redux/hooks';
import { selectRole } from '@/redux/slices/authSlice';
import { Roles } from '@/common/constants/roles';

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
  const dispatch = useAppDispatch();
  const status = useSelector(selectStatus);
  const errorMessage = useSelector(selectErrorMessage);
  const navigate = useNavigate();
  const userRole = useAppSelector(selectRole);
  const isTeacher = userRole === Roles.TEACHER;

  // Lấy MSSV từ URL parameter
  const { studentId } = useParams<{ studentId: string }>();

  useEffect(() => {
    // Reset status or add a dependency to force refetch when studentId changes
    if (studentId) {
      // Always fetch when studentId changes, not just when status is idle
      dispatch(fetchStudentProgress(studentId));
    }
  }, [dispatch, studentId]); // Remove status dependency to ensure fetching on studentId change

  const handleBack = () => {
    navigate('/tong-quan-tien-do');
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" component="h1">
          Bảng Tiến Độ Học Tập {studentId && `- MSSV: ${studentId}`}
        </Typography>
        {isTeacher && (
          <IconButton
            color="primary"
            aria-label="back to course progress"
            onClick={handleBack}
            sx={{ ml: 2 }}
          >
            <ExitToAppIcon />
          </IconButton>
        )}
      </Box>

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
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="xl">
        <Dashboard />
      </Container>
    </ThemeProvider>
  );
};

export default Index;