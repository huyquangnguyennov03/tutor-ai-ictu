import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  LinearProgress,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  Grid,
  SelectChangeEvent,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Divider
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectStudents,
  sortStudents,
  filterStudents,
  selectStatus
} from '@/redux/slices/teacherDashboardSlice';
import type { Student } from '@/redux/slices/teacherDashboardSlice';
import type { AppDispatch } from '@/redux/store';

// Use the correctly typed dispatch
const useAppDispatch = () => useDispatch<AppDispatch>();

const StudentList: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const students = useSelector(selectStudents);
  const status = useSelector(selectStatus);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  // Handle sort change
  const handleSortChange = (event: SelectChangeEvent) => {
    const sortValue = event.target.value as 'alphabetical' | 'score' | 'progress';
    dispatch(sortStudents(sortValue));
  };

  // Handle filter change
  const handleFilterChange = (event: SelectChangeEvent) => {
    const filterValue = event.target.value as 'all' | 'active' | 'inactive';
    dispatch(filterStudents(filterValue));
  };

  // Handle search input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Lưu giá trị gốc (bao gồm khoảng trắng) để hiển thị trong ô input
    setSearchTerm(event.target.value);
    // Việc trim() sẽ được thực hiện khi lọc, không phải khi lưu giá trị
  };

  // Navigate to student details page with enhanced information
  const handleViewDetails = (student: Student) => {
    localStorage.setItem('selectedStudent', JSON.stringify({
      name: student.name,
      studentId: student.mssv,
      class: student.class || '',
      courseLevel: 'Lập trình nâng cao',
      updateDate: new Date().toLocaleDateString('vi-VN')
    }));
    navigate(`/app/tien-do-hoc-tap/${student.mssv}`);
  };

  // Toggle dialog open/close
  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  // Filter students based on search term - safely check for undefined
  // Kết quả này được sử dụng cho cả danh sách chính và dialog
  const trimmedSearchTerm = searchTerm.trim(); // Loại bỏ khoảng trắng thừa
  const filteredStudents = students && students.length > 0
    ? students.filter(student =>
      student.name.toLowerCase().includes(trimmedSearchTerm.toLowerCase()) ||
      student.mssv.includes(trimmedSearchTerm)
    )
    : [];

  // Get status color based on score (unchanged)
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'đạt chỉ tiêu': return '#4caf50';
      case 'khá': return '#2196f3';
      case 'cần cải thiện': return '#ff9800';
      case 'nguy hiểm': return '#f44336';
      default: return '#757575';
    }
  };

  // Get progress bar color based on progress percentage
  const getProgressColor = (progress: number) => {
    if (progress >= 80) return '#4caf50'; // Green for high progress
    if (progress >= 60) return '#2196f3'; // Blue for good progress
    if (progress >= 40) return '#ffeb3b'; // Yellow for moderate progress
    if (progress >= 20) return '#ff9800'; // Orange for low progress
    return '#f44336'; // Red for very low progress
  };

  // Render student table
  const renderStudentTable = (students: Student[], isDialog: boolean = false) => {
    return (
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="student table">
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell>MSSV</TableCell>
              <TableCell>Tên sinh viên</TableCell>
              <TableCell>Tiến độ</TableCell>
              <TableCell>Điểm hiện tại</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.mssv} hover>
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
                    <Box sx={{ minWidth: 35 }}>
                      <Typography variant="body2" color="text.secondary">{student.progress}%</Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>{student.score}/4</TableCell>
                <TableCell>
                  <Typography
                    sx={{
                      color: getStatusColor(student.status),
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                      fontSize: '0.75rem'
                    }}
                  >
                    {student.status}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleViewDetails(student)}
                  >
                    Chi tiết
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  // Render loading state
  if (status === 'loading') {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>Đang tải danh sách sinh viên...</Typography>
      </Box>
    );
  }

  // Render error state or empty list
  if (!students || students.length === 0) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1">
          {status === 'failed' ? 'Không thể tải danh sách sinh viên. Vui lòng thử lại sau.' : 'Không có sinh viên nào trong danh sách.'}
        </Typography>
      </Paper>
    );
  }

  return (
    <Box>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            placeholder="Tìm kiếm theo tên hoặc MSSV"
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={6} md={4}>
          <FormControl fullWidth size="small">
            <InputLabel>Sắp xếp theo</InputLabel>
            <Select
              defaultValue="alphabetical"
              label="Sắp xếp theo"
              onChange={handleSortChange}
            >
              <MenuItem value="alphabetical">Tên (A-Z)</MenuItem>
              <MenuItem value="score">Điểm (Cao-Thấp)</MenuItem>
              <MenuItem value="progress">Tiến độ (Cao-Thấp)</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6} md={4}>
          <FormControl fullWidth size="small">
            <InputLabel>Lọc</InputLabel>
            <Select
              defaultValue="all"
              label="Lọc"
              onChange={handleFilterChange}
            >
              <MenuItem value="all">Tất cả sinh viên</MenuItem>
              <MenuItem value="active">Sinh viên tích cực</MenuItem>
              <MenuItem value="inactive">Sinh viên không tích cực</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Main student table - limited to 5 students */}
      {renderStudentTable(filteredStudents.slice(0, 5))}

      {/* "Xem Thêm" Button - chỉ hiển thị khi có nhiều hơn 5 sinh viên */}
      {filteredStudents.length > 5 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenDialog}
            sx={{
              minWidth: 120,
              borderRadius: 20,
              textTransform: 'none',
              fontSize: '1rem'
            }}
          >
            Xem thêm {filteredStudents.length - 5} sinh viên
          </Button>
        </Box>
      )}

      {/* Full Student List Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Danh sách sinh viên</Typography>
          <IconButton aria-label="close" onClick={handleCloseDialog}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent>
          {renderStudentTable(filteredStudents, true)}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default StudentList;