import React from 'react';
import { Box, LinearProgress, Typography } from '@mui/material';

interface ProgressBarProps {
  progress: number;
  label?: string;
  color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
}

const ProgressBar: React.FC<ProgressBarProps> = ({
                                                   progress,
                                                   label,
                                                   color = 'primary'
                                                 }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress
          variant="determinate"
          value={progress}
          color={color}
          sx={{
            height: 10,
            borderRadius: 5,
            backgroundColor: '#e0e0e0'
          }}
        />
      </Box>
      {label && (
        <Box sx={{ minWidth: 35 }}>
          <Typography variant="body2" color="text.secondary">
            {label}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ProgressBar;