import React, { useState } from 'react';
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
  SelectChangeEvent
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useDispatch, useSelector } from 'react-redux';
import { selectStudents, sortStudents, filterStudents } from '@/redux/slices/teacherDashboardSlice';

const StudentList = () => {
  const dispatch = useDispatch();
  const students = useSelector(selectStudents) || []; // Add default empty array if undefined
  const [searchTerm, setSearchTerm] = useState('');

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

  // Render loading or error state if no students
  if (!students || students.length === 0) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="body1">Đang tải dữ liệu sinh viên...</Typography>
      </Box>
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
            {filteredStudents.map((student) => (
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
                <TableCell>{student.score}/10</TableCell>
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
                  <Button variant="outlined" size="small">Chi tiết</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default StudentList;