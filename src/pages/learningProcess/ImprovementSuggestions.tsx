import React from 'react';
import { Box, Typography, Paper, Alert, CircularProgress } from '@mui/material';
import { useSelector } from 'react-redux';
import { selectSuggestions, selectStatus } from '@/redux/slices/studentProgressSlice';

const ImprovementSuggestions: React.FC = () => {
  const suggestions = useSelector(selectSuggestions);
  const status = useSelector(selectStatus);

  if (status === 'loading') {
    return (
      <Paper sx={{ mb: 3, p: 3, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>Đang tải đề xuất cải thiện...</Typography>
      </Paper>
    );
  }

  if (!suggestions || !Array.isArray(suggestions) || suggestions.length === 0) {
    return (
      <Paper sx={{ mb: 3, p: 3 }}>
        <Typography variant="body1">Không có đề xuất cải thiện.</Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ mb: 3 }}>
      <Box sx={{ p: 2, bgcolor: '#1976d2', color: 'white' }}>
        <Typography variant="h6">Đề Xuất Cải Thiện</Typography>
      </Box>
      <Box sx={{ p: 2 }}>
        {Array.isArray(suggestions) && suggestions.map((suggestion) => {
          // Kiểm tra suggestion có đầy đủ dữ liệu không
          if (!suggestion || typeof suggestion !== 'object') {
            return null;
          }
          
          // Xác định severity hợp lệ
          const validSeverities = ['success', 'info', 'warning', 'error'];
          const severity = suggestion.type && validSeverities.includes(suggestion.type) 
            ? suggestion.type 
            : 'info';
          
          return (
            <Alert
              key={suggestion.id || 'unknown'}
              severity={severity}
              sx={{ mb: 2 }}
            >
              <Typography variant="subtitle2">{suggestion.title || 'Đề xuất'}</Typography>
              <Typography variant="body2">{suggestion.content || 'Không có nội dung'}</Typography>
            </Alert>
          );
        })}
      </Box>
    </Paper>
  );
};

export default ImprovementSuggestions;