import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, Tabs, Tab, Box, Typography, Button, Table, TableHead, TableRow,
  TableCell, TableBody, Paper, CircularProgress, Snackbar, Alert, DialogActions
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
          Danh sách sinh viên - {assignmentName}
        </Typography>
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
            <Tabs value={tabIndex} onChange={handleTabChange} sx={{ mb: 2, borderBottom: 1, borderColor: 'divider' }}>
              <Tab label={`Đã nộp (${submissionData?.studentsSubmitted?.length || 0})`} />
              <Tab label={`Chưa nộp (${submissionData?.studentsNotSubmitted?.length || 0})`} />
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