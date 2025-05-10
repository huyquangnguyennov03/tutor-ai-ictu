import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { useSelector } from 'react-redux';
import { selectStudentInfo } from '@/redux/slices/studentProgressSlice';

const StudentInfo: React.FC = () => {
  const studentInfo = useSelector(selectStudentInfo);

  if (!studentInfo) {
    return <Paper sx={{ p: 2, mb: 2 }}>Đang tải thông tin sinh viên...</Paper>;
  }

  const { name, studentId, courseLevel, updateDate } = studentInfo;

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography component="span" variant="body1">
          <strong>Tên:</strong> {name}
        </Typography>
        <Typography component="span" variant="body1">
          <strong>MSSV:</strong> {studentId}
        </Typography>
        <Typography component="span" variant="body1">
          <strong>Khóa học:</strong> {courseLevel}
        </Typography>
        <Typography component="span" variant="body1">
          <strong>Ngày cập nhật:</strong> {updateDate}
        </Typography>
      </Box>
    </Paper>
  );
};

export default StudentInfo;