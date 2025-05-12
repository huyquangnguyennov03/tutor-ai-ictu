import React, { useEffect } from 'react';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Box,
  Container,
  Paper,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Typography
} from '@mui/material';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store, AppDispatch } from '@/redux/store';
import {
  fetchDashboardData,
  setSelectedTab,
  selectSelectedTab,
  selectStatus,
  selectError,
  selectCurrentCourse,
  selectCurrentSemester
} from '@/redux/slices/teacherDashboardSlice';
import CDashboardHeader from './CDashboardHeader';
import CDashboardSummary from './CDashboardSummary';
import StudentList from './StudentList';
import ChapterProgress from './ChapterProgress';
import AssignmentManagement from './AssignmentManagement';
import Warnings from './Warnings';

// Theme setup
const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
    error: { main: '#f44336' },
    warning: { main: '#ff9800' },
    info: { main: '#2196f3' },
    success: { main: '#4caf50' },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const tabValue = useSelector(selectSelectedTab);
  const status = useSelector(selectStatus);
  const error = useSelector(selectError);
  const currentCourse = useSelector(selectCurrentCourse);
  const currentSemester = useSelector(selectCurrentSemester);

  useEffect(() => {
    dispatch(fetchDashboardData({ courseId: currentCourse, semesterId: currentSemester }));
  }, [dispatch, currentCourse, currentSemester]);

  if (status === 'loading') {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (status === 'failed') {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
        <Alert severity="error">{error || 'Đã xảy ra lỗi khi tải dữ liệu'}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}>
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Bảng điều khiển giảng viên
          </Typography>

          <CDashboardHeader />
          <CDashboardSummary />

          <Paper sx={{ mb: 4 }}>
            <Tabs
              value={tabValue}
              onChange={(e, v) => dispatch(setSelectedTab(v))}
              variant="fullWidth"
              sx={{
                borderBottom: 1,
                borderColor: 'divider',
                backgroundColor: '#f5f5f5',
                '& .Mui-selected': {
                  fontWeight: 'bold',
                  color: 'primary.main',
                }
              }}
            >
              <Tab label="Danh sách sinh viên" />
              <Tab label="Tiến độ theo chương" />
              <Tab label="Bài tập & Nộp bài" />
              <Tab label="Cảnh báo & Nhắc nhở" />
            </Tabs>

            <Box sx={{ p: 3 }}>
              {tabValue === 0 && <StudentList />}
              {tabValue === 1 && <ChapterProgress />}
              {tabValue === 2 && <AssignmentManagement />}
              {tabValue === 3 && <Warnings />}
            </Box>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

// Wrapping with Provider and Theme like Index 1
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