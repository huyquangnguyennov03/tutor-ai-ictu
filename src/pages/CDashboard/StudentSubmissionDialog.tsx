import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, Tabs, Tab, Box, Typography, Button, Table, TableHead, TableRow,
  TableCell, TableBody, Paper
} from '@mui/material';

const studentsSubmitted = [
  { id: '21520001', name: 'Nguyễn Văn An', progress: 85, score: '8.5/10', status: 'ĐẠT CHỈ TIÊU' },
  { id: '21520002', name: 'Trần Thị Bình', progress: 72, score: '7.8/10', status: 'KHÁ' },
];

const studentsNotSubmitted = [
  { id: '21520004', name: 'Phạm Thị Dung', progress: 25, score: '3.5/10', status: 'NGUY HIỂM' },
  { id: '21520006', name: 'Phan Văn Fong', progress: 30, score: '4.2/10', status: 'NGUY HIỂM' },
];

const StudentSubmissionDialog = ({ open, onClose }) => {
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (_, newIndex) => {
    setTabIndex(newIndex);
  };

  const renderTable = (students, showReminder) => (
    <Paper sx={{ mt: 2 }}>
      <Table>
        <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
          <TableRow>
            <TableCell><b>MSSV</b></TableCell>
            <TableCell><b>Tên sinh viên</b></TableCell>
            <TableCell><b>Tiến độ</b></TableCell>
            <TableCell><b>Điểm hiện tại</b></TableCell>
            <TableCell><b>Trạng thái</b></TableCell>
            <TableCell><b>Hành động</b></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {students.map((s) => (
            <TableRow key={s.id}>
              <TableCell>{s.id}</TableCell>
              <TableCell>{s.name}</TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ width: 80, height: 8, backgroundColor: '#eee', borderRadius: 5, mr: 1 }}>
                    <Box sx={{
                      width: `${s.progress}%`,
                      height: '100%',
                      backgroundColor: s.progress > 75 ? '#4caf50' : s.progress > 50 ? '#2196f3' : '#f44336',
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
                    s.status === 'KHÁ' ? 'blue' :
                      s.status === 'NGUY HIỂM' ? 'red' : 'orange'
                }>
                  {s.status}
                </Typography>
              </TableCell>
              <TableCell>
                <Button size="small" variant="outlined">Chi tiết</Button>
                {showReminder && (
                  <Button size="small" variant="contained" color="warning" sx={{ ml: 1 }}>
                    Nhắc nhở
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>Danh sách sinh viên</DialogTitle>
      <DialogContent>
        <Tabs value={tabIndex} onChange={handleTabChange} sx={{ mb: 2 }}>
          <Tab label="Đã nộp" />
          <Tab label="Chưa nộp" />
        </Tabs>
        {tabIndex === 0 && renderTable(studentsSubmitted, false)}
        {tabIndex === 1 && renderTable(studentsNotSubmitted, true)}
      </DialogContent>
    </Dialog>
  );
};

export default StudentSubmissionDialog;