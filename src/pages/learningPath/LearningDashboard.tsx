// src/pages/learningPath/LearningDashboard.tsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import {
  fetchLearningPathAsync,
  selectAllCourses,
  selectInProgressCourses,
  selectRecommendedCourses,
  selectActiveTab,
  selectStatus,
  selectError,
  setActiveTab,
  clearError
} from '@/redux/slices/learningPathSlice';
import {
  Box,
  Typography,
  Container,
  Tabs,
  Tab,
  Alert
} from '@mui/material';
import TabPanel from './TabPanel';
import CourseList from './CourseList';

const LearningDashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const allCourses = useSelector(selectAllCourses);
  const inProgressCourses = useSelector(selectInProgressCourses);
  const recommendedCourses = useSelector(selectRecommendedCourses);
  const activeTab = useSelector(selectActiveTab);
  const status = useSelector(selectStatus);
  const error = useSelector(selectError);

  // Giả định studentId, trong thực tế có thể lấy từ authentication state
  const [studentId] = useState('1');

  useEffect(() => {
    // Tải dữ liệu lộ trình học tập khi component được mount
    dispatch(fetchLearningPathAsync(studentId));
  }, [dispatch, studentId]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    dispatch(setActiveTab(newValue));
  };

  const isLoading = status === 'loading';

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box mb={2}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Lộ trình học tập
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Theo dõi tiến độ học tập và khám phá các khóa học mới tại ICTU
        </Typography>
      </Box>

      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 2 }} 
          onClose={() => dispatch(clearError())}
        >
          {error}
        </Alert>
      )}

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 4 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="course tabs"
          TabIndicatorProps={{
            style: {
              display: 'none',
            }
          }}
          sx={{
            '& .MuiTab-root': {
              px: 3,
              py: 1,
              minWidth: 'auto',
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '0.875rem',
              '&.Mui-selected': {
                color: 'primary.main',
                bgcolor: 'rgba(25, 118, 210, 0.08)',
                borderRadius: '4px 4px 0 0',
              },
            },
          }}
        >
          <Tab label="Khóa học đang học" disableRipple />
          <Tab label="Khóa học đề xuất" disableRipple />
          <Tab label="Tất cả khóa học" disableRipple />
        </Tabs>
      </Box>

      <TabPanel value={activeTab} index={0}>
        <CourseList 
          courses={inProgressCourses} 
          loading={isLoading} 
          emptyMessage="Bạn chưa có khóa học nào đang học. Hãy đăng ký một khóa học để bắt đầu học!"
        />
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        <CourseList 
          courses={recommendedCourses} 
          loading={isLoading} 
          emptyMessage="Hiện tại không có khóa học nào được đề xuất cho bạn. Vui lòng quay lại sau!"
        />
      </TabPanel>

      <TabPanel value={activeTab} index={2}>
        <CourseList 
          courses={allCourses} 
          loading={isLoading} 
          emptyMessage="Hiện tại không có khóa học nào. Vui lòng quay lại sau!"
        />
      </TabPanel>
    </Container>
  );
};

export default LearningDashboard;