import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, Tabs, Tab, Box, Typography, Button, Table, TableHead, TableRow,
  TableCell, TableBody, Paper, CircularProgress, Snackbar, Alert, DialogActions, Chip
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import {
  fetchAssignmentSubmission,
  selectCurrentAssignmentSubmission,
  selectAssignmentSubmissionStatus,
  sendReminderToStudent,
  StudentSubmission
} from '@/redux/slices/teacherDashboardSlice';

interface StudentSubmissionDialogProps {
  open: boolean;
  onClose: () => void;
  assignmentName?: string;
}

const StudentSubmissionDialog = ({ open, onClose, assignmentName = 'Bài tập 5: Hàm' }: StudentSubmissionDialogProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const submissionData = useSelector(selectCurrentAssignmentSubmission);
  const status = useSelector(selectAssignmentSubmissionStatus);

  const [tabIndex, setTabIndex] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  // Tải dữ liệu khi mở dialog
  useEffect(() => {
    if (open && (!submissionData || submissionData.name !== assignmentName)) {
      dispatch(fetchAssignmentSubmission(assignmentName));
    }
  }, [open, assignmentName, dispatch, submissionData]);

  const handleTabChange = (_: React.SyntheticEvent, newIndex: number) => {
    setTabIndex(newIndex);
  };

  const handleReminderClick = (mssv: string, studentName: string) => {
    dispatch(sendReminderToStudent({ assignmentName, mssv }))
      .unwrap()
      .then(() => {
        setSnackbarMessage(`Đã gửi nhắc nhở cho sinh viên ${studentName} (${mssv})`);
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      })
      .catch((error) => {
        setSnackbarMessage(`Lỗi: Không thể gửi nhắc nhở - ${error}`);
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      });
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleViewDetails = (mssv: string) => {
    console.log(`Đang xem chi tiết sinh viên ${mssv}`);
    // Chức năng xem chi tiết sinh viên sẽ được triển khai sau
  };

  // Format deadline date
  const formatDeadline = (isoDate: string) => {
    if (!isoDate) return '';
    const date = new Date(isoDate);
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const renderTable = (students: StudentSubmission[], showReminder: boolean) => (
    <Paper sx={{ mt: 2, overflow: 'auto', maxHeight: 400 }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>MSSV</TableCell>
            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Tên sinh viên</TableCell>
            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Tiến độ</TableCell>
            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Điểm hiện tại</TableCell>
            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Trạng thái</TableCell>
            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Hành động</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {students.length > 0 ? (
            students.map((s) => (
              <TableRow key={s.mssv}>
                <TableCell>{s.mssv}</TableCell>
                <TableCell>{s.name}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ width: 80, height: 8, backgroundColor: '#eee', borderRadius: 5, mr: 1 }}>
                      <Box sx={{
                        width: `${s.progress}%`,
                        height: '100%',
                        backgroundColor: s.progress > 75 ? '#4caf50' : s.progress > 50 ? '#2196f3' : s.progress > 30 ? '#ff9800' : '#f44336',
                        borderRadius: 5
                      }} />
                    </Box>
                    {s.progress}%
                  </Box>
                </TableCell>
                <TableCell>{s.score}</TableCell>
                <TableCell>
                  <Typography color={
                    s.status === 'ĐẠT CHỈ TIÊU' ? 'green' :
                      s.status === 'KHÁ' ? '#2196f3' :
                        s.status === 'CẦN CẢI THIỆN' ? 'orange' : 'red'
                  } fontWeight="medium">
                    {s.status}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => handleViewDetails(s.mssv)}
                    sx={{ mr: 1 }}
                  >
                    Chi tiết
                  </Button>
                  {showReminder && (
                    <Button
                      size="small"
                      variant="contained"
                      color="warning"
                      onClick={() => handleReminderClick(s.mssv, s.name)}
                    >
                      Nhắc nhở
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} align="center">
                <Typography variant="body1" sx={{ py: 2 }}>Không có sinh viên nào trong danh sách này</Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Paper>
  );

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>
        <Typography variant="h6" component="div">
          {submissionData?.name || assignmentName}
        </Typography>
        {submissionData?.deadline && (
          <Box sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
              Deadline:
            </Typography>
            <Chip
              label={formatDeadline(submissionData.deadline)}
              color="warning"
              size="small"
              sx={{ fontWeight: 'medium' }}
            />
          </Box>
        )}
      </DialogTitle>

      <DialogContent>
        {status === 'loading' ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : status === 'failed' ? (
          <Box sx={{ py: 2 }}>
            <Alert severity="error">
              Không thể tải dữ liệu. Vui lòng thử lại sau.
            </Alert>
          </Box>
        ) : (
          <>
            {submissionData && (
              <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                <Paper sx={{ p: 2, flex: '1 1 200px', bgcolor: '#e3f2fd' }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>Tổng số sinh viên</Typography>
                  <Typography variant="h4">{submissionData.totalStudents || 0}</Typography>
                </Paper>

                <Paper sx={{ p: 2, flex: '1 1 200px', bgcolor: '#e8f5e9' }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>Đã nộp bài</Typography>
                  <Typography variant="h4">{submissionData.submittedCount || 0}</Typography>
                </Paper>

                <Paper sx={{ p: 2, flex: '1 1 200px', bgcolor: '#fff3e0' }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>Chưa nộp bài</Typography>
                  <Typography variant="h4">{submissionData.notSubmittedCount || 0}</Typography>
                </Paper>

                <Paper sx={{ p: 2, flex: '1 1 200px', bgcolor: '#f5f5f5' }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>Tỷ lệ hoàn thành</Typography>
                  <Typography variant="h4">
                    {submissionData.totalStudents ?
                      Math.round((submissionData.submittedCount / submissionData.totalStudents) * 100) : 0}%
                  </Typography>
                </Paper>
              </Box>
            )}

            <Tabs value={tabIndex} onChange={handleTabChange} sx={{ mb: 2, borderBottom: 1, borderColor: 'divider' }}>
              <Tab label={`Đã nộp (${submissionData?.submittedCount || submissionData?.studentsSubmitted?.length || 0})`} />
              <Tab label={`Chưa nộp (${submissionData?.notSubmittedCount || submissionData?.studentsNotSubmitted?.length || 0})`} />
            </Tabs>

            {tabIndex === 0 && submissionData && renderTable(submissionData.studentsSubmitted, false)}
            {tabIndex === 1 && submissionData && renderTable(submissionData.studentsNotSubmitted, true)}
          </>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="primary">
          Đóng
        </Button>
      </DialogActions>

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Dialog>
  );
};

export default StudentSubmissionDialog;