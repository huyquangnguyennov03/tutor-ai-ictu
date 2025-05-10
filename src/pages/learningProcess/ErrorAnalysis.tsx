import React from 'react';
import { Box, Typography, Paper, CircularProgress } from '@mui/material';
import { useSelector } from 'react-redux';
import { selectErrors, selectStatus } from '@/redux/slices/studentProgressSlice';

// Define the interface for ProgressBar props
interface ProgressBarProps {
  progress: number;
  color: 'success' | 'warning' | 'error' | 'info' | 'primary'; // Define the allowed color types
}

// Custom ProgressBar component with explicit prop types
const ProgressBar: React.FC<ProgressBarProps> = ({ progress, color }) => {
  return (
    <Box
      sx={{
        height: 8,
        width: '100%',
        borderRadius: 5,
        backgroundColor: '#e0e0e0',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          left: 0,
          top: 0,
          height: '100%',
          width: `${progress}%`,
          backgroundColor:
            color === 'success' ? '#4caf50' :
              color === 'warning' ? '#ff9800' :
                color === 'error' ? '#f44336' :
                  color === 'info' ? '#2196f3' : '#1976d2'
        }}
      />
    </Box>
  );
};

const ErrorAnalysis: React.FC = () => {
  const errors = useSelector(selectErrors);
  const status = useSelector(selectStatus);

  if (status === 'loading') {
    return (
      <Paper sx={{ mb: 3, p: 3, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>Đang tải dữ liệu phân tích lỗi...</Typography>
      </Paper>
    );
  }

  if (!errors || errors.length === 0) {
    return (
      <Paper sx={{ mb: 3, p: 3 }}>
        <Typography variant="body1">Không có dữ liệu phân tích lỗi.</Typography>
      </Paper>
    );
  }

  // Find the maximum error count for scaling
  const maxErrorCount = Math.max(...errors.map(error => error.count));

  return (
    <Paper sx={{ mb: 3 }}>
      <Box sx={{ p: 2, bgcolor: '#1976d2', color: 'white' }}>
        <Typography variant="h6">Phân Tích Lỗi Biên Dịch</Typography>
      </Box>

      <Box sx={{ p: 2 }}>
        <Typography variant="subtitle1" sx={{ mb: 2 }}>Các Lỗi Phổ Biến</Typography>

        {errors.map((error, index) => (
          <Box key={index} sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="body2" color="error">
                {error.name}
              </Typography>
              <Typography variant="body2">
                {error.count} lần
              </Typography>
            </Box>
            <ProgressBar
              progress={(error.count / maxErrorCount) * 100}
              color="info" // Or you can dynamically change this based on the error type
            />
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default ErrorAnalysis;
