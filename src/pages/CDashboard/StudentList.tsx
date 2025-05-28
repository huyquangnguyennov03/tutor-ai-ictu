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
  const [displayedStudents, setDisplayedStudents] = useState<Student[]>([]);

  // Set up displayed students - limited to 5 for the main list
  useEffect(() => {
    if (students && students.length > 0) {
      setDisplayedStudents(students.slice(0, 5));
    }
  }, [students]);

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
    setSearchTerm(event.target.value);
  };

  // Navigate to student details page with enhanced information
  const handleViewDetails = (student: Student) => {
    // Store student data in localStorage to access it on the details page
    localStorage.setItem('selectedStudent', JSON.stringify({
      name: student.name,
      studentId: student.mssv,
      courseLevel: 'Lập trình nâng cao', // Default value or get from your data
      updateDate: new Date().toLocaleDateString('vi-VN')
    }));

    // Navigate to student progress page with student ID as parameter
    navigate(`/tien-do-hoc-tap/${student.mssv}`);
  };

  // Toggle dialog open/close
  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  // Filter students based on search term - safely check for undefined
  const filteredStudents = students && students.length > 0
    ? students.filter(student =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.mssv.includes(searchTerm)
    )
    : [];

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'đạt chỉ tiêu': return '#4caf50';
      case 'khá': return '#2196f3';
      case 'cần cải thiện': return '#ff9800';
      case 'nguy hiểm': return '#f44336';
      default: return '#757575';
    }
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
                            backgroundColor: student.progressColor
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
      {renderStudentTable(displayedStudents)}

      {/* "Xem Thêm" Button */}
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
          Xem thêm
        </Button>
      </Box>

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