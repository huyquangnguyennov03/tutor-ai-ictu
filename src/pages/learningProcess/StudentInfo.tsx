import React from 'react';
import { Box, Typography, Paper, CircularProgress } from '@mui/material';
import { useSelector } from 'react-redux';
import { selectStudentInfo, selectStatus } from '@/redux/slices/studentProgressSlice';

const StudentInfo: React.FC = () => {
  const studentInfo = useSelector(selectStudentInfo);
  const status = useSelector(selectStatus);

  if (status === 'loading') {
    return (
      <Paper sx={{ p: 2, mb: 2, textAlign: 'center' }}>
        <CircularProgress size={20} />
        <Typography variant="body2" sx={{ mt: 1 }}>Đang tải thông tin sinh viên...</Typography>
      </Paper>
    );
  }

  if (!studentInfo) {
    return <Paper sx={{ p: 2, mb: 2 }}>Không tìm thấy thông tin sinh viên</Paper>;
  }

  const { name, studentId, courseLevel, updateDate, class: studentClass } = studentInfo;

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
        <Typography component="span" variant="body1" sx={{ my: 0.5 }}>
          <strong>Tên:</strong> {name}
        </Typography>
        <Typography component="span" variant="body1" sx={{ my: 0.5 }}>
          <strong>MSSV:</strong> {studentId}
        </Typography>
        <Typography component="span" variant="body1" sx={{ my: 0.5 }}>
          <strong>Lớp:</strong> {studentClass || 'Chưa xác định'}
        </Typography>
        <Typography component="span" variant="body1" sx={{ my: 0.5 }}>
          <strong>Khóa học:</strong> {courseLevel}
        </Typography>
        <Typography component="span" variant="body1" sx={{ my: 0.5 }}>
          <strong>Ngày cập nhật:</strong> {updateDate}
        </Typography>
      </Box>
    </Paper>
  );
};

export default StudentInfo;