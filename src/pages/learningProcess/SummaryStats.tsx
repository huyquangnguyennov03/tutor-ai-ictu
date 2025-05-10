import React from 'react';
import { Grid, Paper, Typography, Box, CircularProgress } from '@mui/material';
import { useSelector } from 'react-redux';
import { selectSummaryStats, selectStatus } from '@/redux/slices/studentProgressSlice';

const SummaryStats: React.FC = () => {
  const summaryStats = useSelector(selectSummaryStats);
  const status = useSelector(selectStatus);

  if (status === 'loading') {
    return (
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sx={{ textAlign: 'center' }}>
          <CircularProgress />
          <Typography variant="body1" sx={{ mt: 2 }}>Đang tải thống kê...</Typography>
        </Grid>
      </Grid>
    );
  }

  if (!summaryStats) {
    return (
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="body1">Không có dữ liệu thống kê.</Typography>
          </Paper>
        </Grid>
      </Grid>
    );
  }

  const {
    totalLearningTime,
    successfulCompilations,
    failedCompilations,
    successRate,
    dailyAverageTime,
    mostCommonError = "array index out of bounds"
  } = summaryStats;

  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      <Grid item xs={12} md={4}>
        <Paper sx={{
          p: 3,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxShadow: 1
        }}>
          <Typography variant="subtitle1" color="primary" sx={{ mb: 2, fontWeight: 500 }}>
            Tổng thời gian học
          </Typography>
          <Typography variant="h4" color="text.primary" sx={{ mb: 1.5, fontWeight: 'medium' }}>
            {totalLearningTime}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Thời gian học trung bình: {dailyAverageTime}/ngày
          </Typography>
        </Paper>
      </Grid>

      <Grid item xs={12} md={4}>
        <Paper sx={{
          p: 3,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxShadow: 1
        }}>
          <Typography variant="subtitle1" color="primary" sx={{ mb: 2, fontWeight: 500 }}>
            Biên dịch thành công
          </Typography>
          <Typography variant="h4" color="text.primary" sx={{ mb: 1.5, fontWeight: 'medium' }}>
            {successfulCompilations}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Tỉ lệ thành công: {successRate}
          </Typography>
        </Paper>
      </Grid>

      <Grid item xs={12} md={4}>
        <Paper sx={{
          p: 3,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxShadow: 1
        }}>
          <Typography variant="subtitle1" color="primary" sx={{ mb: 2, fontWeight: 500 }}>
            Biên dịch thất bại
          </Typography>
          <Typography variant="h4" color="text.primary" sx={{ mb: 1.5, fontWeight: 'medium' }}>
            {failedCompilations}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Lỗi phổ biến: {mostCommonError}
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default SummaryStats;