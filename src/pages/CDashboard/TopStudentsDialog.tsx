import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  LinearProgress,
  Typography,
  Box,
  Paper
} from '@mui/material';

interface Student {
  mssv: string;
  name: string;
  score: number;
  progress: number;
}

interface TopStudentsDialogProps {
  open: boolean;
  onClose: () => void;
  students: Student[];
}

const getProgressColor = (progress: number): string => {
  if (progress >= 85) return '#4caf50'; // Green
  if (progress >= 75) return '#2196f3'; // Blue
  if (progress >= 50) return '#757575'; // Gray
  if (progress >= 25) return '#ff9800'; // Orange
  return '#f44336'; // Red
};

const getStatusText = (score: number): { text: string; color: string } => {
  if (score >= 8) return { text: 'ĐẠT CHỈ TIÊU', color: '#4caf50' }; // Green
  if (score >= 7) return { text: 'KHÁ', color: '#2196f3' }; // Blue
  if (score >= 5) return { text: 'CẦN CẢI THIỆN', color: '#ff9800' }; // Orange
  return { text: 'NGUY HIỂM', color: '#f44336' }; // Red
};

const TopStudentsDialog: React.FC<TopStudentsDialogProps> = ({ open, onClose, students }) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle sx={{ fontWeight: 'bold', textAlign: 'center' }}>
        Danh sách sinh viên
      </DialogTitle>

      <DialogContent>
        <Paper elevation={1} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Table>
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell><strong>MSSV</strong></TableCell>
                <TableCell><strong>Tên sinh viên</strong></TableCell>
                <TableCell><strong>Tiến độ</strong></TableCell>
                <TableCell><strong>Điểm hiện tại</strong></TableCell>
                <TableCell><strong>Trạng thái</strong></TableCell>
                <TableCell><strong>Hành động</strong></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {students.map((student) => {
                const status = getStatusText(student.score);

                return (
                  <TableRow key={student.mssv}>
                    <TableCell>{student.mssv}</TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ width: '100%', mr: 1 }}>
                          <LinearProgress
                            variant="determinate"
                            value={student.progress}
                            sx={{
                              height: 10,
                              borderRadius: 5,
                              backgroundColor: '#e0e0e0',
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: getProgressColor(student.progress)
                              }
                            }}
                          />
                        </Box>
                        <Box sx={{ minWidth: 30 }}>
                          <Typography variant="body2" color="text.secondary">
                            {`${student.progress}%`}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{student.score.toFixed(1)}/10</TableCell>
                    <TableCell>
                      <Typography sx={{ color: status.color, fontWeight: 'bold' }}>
                        {status.text}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Button variant="outlined" size="small">Chi tiết</Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Paper>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="outlined">Đóng</Button>
      </DialogActions>
    </Dialog>
  );
};

export default TopStudentsDialog;