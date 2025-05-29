import React, { useEffect } from 'react';
import { Box, Paper, Grid, Typography, LinearProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectClassInfo,
  selectActivityRate,
  fetchActivityRate,
  selectStatus,
  selectCurrentCourse,
} from '@/redux/slices/teacherDashboardSlice';
import type { AppDispatch } from '@/redux/store';

// Custom styled components
const StatsCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
}));

const CDashboardSummary = () => {
  const dispatch = useDispatch<AppDispatch>();
  const classInfo = useSelector(selectClassInfo);
  const activityRate = useSelector(selectActivityRate);
  const status = useSelector(selectStatus);
  const currentCourse = useSelector(selectCurrentCourse);

  // Fetch activity rate with currentCourse
  useEffect(() => {
    console.log(`useEffect triggered, status: ${status}, currentCourse: ${currentCourse}`);
    if (currentCourse && (status === 'idle' || status === 'failed')) {
      dispatch(fetchActivityRate(currentCourse));
    }
  }, [dispatch, status, currentCourse]);

  // Display placeholders if data is not yet loaded
  if (!classInfo && (activityRate === null || status === 'loading')) {
    return (
      <Box sx={{ mb: 4 }}>
        <Paper sx={{ p: 2 }}>
          <Typography>Loading class information...</Typography>
        </Paper>
      </Box>
    );
  }

  if (!classInfo) {
    return (
      <Box sx={{ mb: 4 }}>
        <Paper sx={{ p: 2 }}>
          <Typography>Loading class information...</Typography>
        </Paper>
      </Box>
    );
  }

  if (status === 'failed') {
    return (
      <Box sx={{ mb: 4 }}>
        <Paper sx={{ p: 2 }}>
          <Typography color="error">Error loading data. Please try again.</Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 4 }}>
      <Paper sx={{ p: 2 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <StatsCard>
              <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                Tổng sinh viên
              </Typography>
              <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                {classInfo.totalStudents}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Đã đăng ký khóa học
              </Typography>
            </StatsCard>
          </Grid>
          <Grid item xs={12} sm={4}>
            <StatsCard>
              <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                Tỷ lệ hoạt động
              </Typography>
              <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                {activityRate !== null ? `${activityRate}%` : `${classInfo.activityRate}%`}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Sinh viên tích cực
              </Typography>
            </StatsCard>
          </Grid>
          <Grid item xs={12} sm={4}>
            <StatsCard>
              <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                Điểm trung bình
              </Typography>
              <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                {classInfo.averageScore.toFixed(1)}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Trên thang điểm 4
              </Typography>
            </StatsCard>
          </Grid>
        </Grid>

        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Tiến độ lớp
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: '100%', mr: 1 }}>
              <LinearProgress
                variant="determinate"
                value={classInfo.overallProgress}
                sx={{ height: 10, borderRadius: 5 }}
              />
            </Box>
            <Box sx={{ minWidth: 35 }}>
              <Typography variant="body2" color="text.secondary">
                {classInfo.overallProgress}%
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default CDashboardSummary;