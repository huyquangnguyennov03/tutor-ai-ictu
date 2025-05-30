import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  LinearProgress,
  CircularProgress
} from '@mui/material';
import { useSelector } from 'react-redux';
import { selectChapters, selectStatus } from '@/redux/slices/studentProgressSlice';

// Định nghĩa interface cho các props của ProgressBar
interface ProgressBarProps {
  progress: number;
  color: 'success' | 'warning' | 'error' | 'primary'; // Các giá trị màu hợp lệ
}

// Custom ProgressBar component với kiểu dữ liệu rõ ràng
const ProgressBar: React.FC<ProgressBarProps> = ({ progress, color }) => {
  return (
    <LinearProgress
      variant="determinate"
      value={progress}
      sx={{
        height: 8,
        borderRadius: 5,
        backgroundColor: '#e0e0e0',
        '& .MuiLinearProgress-bar': {
          backgroundColor: color === 'success' ? '#4caf50' :
            color === 'warning' ? '#ff9800' :
              color === 'error' ? '#f44336' : '#1976d2'
        }
      }}
    />
  );
};

const ChapterProgress: React.FC = () => {
  const chapters = useSelector(selectChapters);
  const status = useSelector(selectStatus);

  // Helper function to determine progress color
  const getProgressColor = (progress: number): 'success' | 'warning' | 'error' | 'primary' => {
    if (progress >= 100) return 'success';
    if (progress >= 60) return 'warning';
    if (progress > 0) return 'error';
    return 'primary';
  };

  // Helper function to determine quiz badge color based on score
  const getScoreBadgeColor = (score: string) => {
    if (score === '-') return '#9e9e9e'; // Gray for no score

    const numericScore = parseInt(score.split('/')[0]);
    if (numericScore >= 8) return '#4caf50'; // Green for high scores
    if (numericScore >= 7) return '#ff9800'; // Orange for medium scores
    return '#ff7043'; // Orange-red for lower scores
  };

  if (status === 'loading') {
    return (
      <Paper sx={{ mb: 3, p: 3, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>Đang tải thông tin chương học...</Typography>
      </Paper>
    );
  }

  // Kiểm tra chapters có tồn tại và có phải là mảng không
  if (!chapters || !Array.isArray(chapters) || chapters.length === 0) {
    return (
      <Paper sx={{ mb: 3, p: 3 }}>
        <Typography variant="body1">Không có thông tin chương học.</Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ mb: 3 }}>
      <Box sx={{ p: 2, bgcolor: '#1976d2', color: 'white' }}>
        <Typography variant="h6">Tiến Độ Theo Chương</Typography>
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#f5f5f5' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>Chương</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Hoàn Thành</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Điểm Quiz</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Bài Tập</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {chapters.map((chapter) => (
              <TableRow key={chapter.id}>
                <TableCell>{chapter.title}</TableCell>
                <TableCell sx={{ width: '40%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ width: '90%', mr: 1 }}>
                      <ProgressBar
                        progress={chapter.progress}
                        color={getProgressColor(chapter.progress)}
                      />
                    </Box>
                    <Typography variant="body2">{chapter.progress}%</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box
                    sx={{
                      bgcolor: getScoreBadgeColor(chapter.quizScore),
                      color: 'white',
                      borderRadius: 5,
                      display: 'inline-block',
                      px: 1.5,
                      py: 0.5
                    }}
                  >
                    {chapter.quizScore}
                  </Box>
                </TableCell>
                <TableCell>{chapter.exercisesCompleted}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default ChapterProgress;