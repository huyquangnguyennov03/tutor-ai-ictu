import React from 'react';
import {
  Box,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Button,
  LinearProgress
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store'; // Import AppDispatch type
import {
  selectCommonErrors,
  selectAssignments,
  sendReminder,
  extendDeadline
} from '@/redux/slices/teacherDashboardSlice';

const AssignmentManagement = () => {
  const commonErrors = useSelector(selectCommonErrors);
  const assignments = useSelector(selectAssignments);
  const dispatch = useDispatch<AppDispatch>(); // Use typed dispatch

  // Function to get appropriate color for progress bar
  const getProgressColor = (completionRate: number): string => {
    if (completionRate >= 70) return 'success.main';
    if (completionRate >= 40) return 'warning.main';
    return 'error.main';
  };

  // Functions to handle button clicks connected to Redux actions
  const handleSendReminder = (assignmentName: string): void => {
    dispatch(sendReminder(assignmentName));
  };

  const handleExtendDeadline = (assignmentName: string): void => {
    dispatch(extendDeadline(assignmentName));
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Bài tập & Nộp bài
      </Typography>

      {/* Common errors section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" gutterBottom sx={{ mt: 3 }}>
          Lỗi biên dịch phổ biến
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell>Loại lỗi</TableCell>
                <TableCell>Số lần xuất hiện</TableCell>
                <TableCell>Số SV gặp phải</TableCell>
                <TableCell>Chương liên quan</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {commonErrors.map((error, index) => (
                <TableRow key={index}>
                  <TableCell>{error.type}</TableCell>
                  <TableCell>{error.occurrences}</TableCell>
                  <TableCell>{error.studentsAffected}</TableCell>
                  <TableCell>{error.relatedChapters}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Upcoming deadlines section */}
      <Box>
        <Typography variant="subtitle1" gutterBottom>
          Deadline sắp tới
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell>Bài tập</TableCell>
                <TableCell>Deadline</TableCell>
                <TableCell>Đã nộp</TableCell>
                <TableCell>Tỷ lệ hoàn thành</TableCell>
                <TableCell>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {assignments.map((assignment, index) => (
                <TableRow key={index}>
                  <TableCell>{assignment.name}</TableCell>
                  <TableCell>{assignment.deadline}</TableCell>
                  <TableCell>{assignment.submitted}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ width: '70%', mr: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={assignment.completionRate}
                          sx={{
                            height: 10,
                            borderRadius: 5,
                            backgroundColor: '#e0e0e0',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: getProgressColor(assignment.completionRate)
                            }
                          }}
                        />
                      </Box>
                      <Typography variant="body2">
                        {assignment.completionRate}%
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      size="small"
                      sx={{ mr: 1, backgroundColor: '#5b9bd5' }}
                      onClick={() => handleSendReminder(assignment.name)}
                    >
                      Gửi nhắc nhở
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      sx={{ backgroundColor: '#ed7d31' }}
                      onClick={() => handleExtendDeadline(assignment.name)}
                    >
                      Gia hạn
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default AssignmentManagement;