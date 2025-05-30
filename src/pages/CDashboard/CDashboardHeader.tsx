import React, { useState } from 'react';
import {
  Paper, Grid, Typography, Button, Box, Tooltip, useMediaQuery, useTheme,
  Snackbar, Alert
} from '@mui/material';
import ClassIcon from '@mui/icons-material/Class';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import CDashboardDialog from './CDashboardDialog';
import {
  selectClassInfo,
  selectCurrentCourse,
  selectCurrentSemester,
  selectCourseOptions,
  selectSemesterOptions,
  selectStudents,
  selectChapters,
  selectAssignments,
  selectWarnings
} from '@/redux/slices/teacherDashboardSlice';
import { exportService } from '@/services/exportService';

const CDashboardHeader = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Get data from Redux store
  const classInfo = useSelector(selectClassInfo);
  const currentCourse = useSelector(selectCurrentCourse);
  const currentSemester = useSelector(selectCurrentSemester);
  const courseOptions = useSelector(selectCourseOptions);
  const semesterOptions = useSelector(selectSemesterOptions);
  const students = useSelector(selectStudents);
  const chapters = useSelector(selectChapters);
  const assignments = useSelector(selectAssignments);
  const warnings = useSelector(selectWarnings);

  // Find current course and semester names
  const currentCourseObj = courseOptions.find(course => course.id === currentCourse);
  const currentSemesterObj = semesterOptions.find(semester => semester.id === currentSemester);

  const courseName = currentCourseObj?.fullName || 'Unknown Course';
  const semesterName = currentSemesterObj?.name || 'Unknown Semester';

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);
  const handleBackToDashboard = () => navigate('/trang-chu');
  
  /**
   * Đóng thông báo snackbar
   */
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  /**
   * Xuất dữ liệu dashboard sang file Excel
   */
  const handleExportToExcel = () => {
    try {
      setIsExporting(true);
      
      // Tạo tên file dựa trên thông tin lớp học và thời gian hiện tại
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
      const fileName = `bao-cao-lop-${currentCourse}-${timestamp}.xlsx`;
      
      // Xuất dữ liệu sang Excel
      exportService.exportToExcel({
        students,
        chapters,
        assignments,
        warnings,
        classInfo,
        currentCourse,
        currentSemester,
        courseOptions,
        semesterOptions
      }, fileName);
      
      // Hiển thị thông báo thành công
      setSnackbarMessage(`Đã xuất báo cáo thành công: ${fileName}`);
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      setIsExporting(false);
    } catch (error) {
      console.error('Lỗi khi xuất file Excel:', error);
      // Hiển thị thông báo lỗi
      setSnackbarMessage('Đã xảy ra lỗi khi xuất báo cáo. Vui lòng thử lại sau.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      setIsExporting(false);
    }
  };

  return (
    <Box sx={{ mb: 4 }}>
      {/* Header chính */}
      <Paper
        sx={{
          p: 2,
          backgroundColor: theme => theme.palette.primary.main,
          color: theme => theme.palette.primary.contrastText,
          borderRadius: 2,
        }}
      >
        <Grid container alignItems="center" spacing={2}>
          <Grid item xs>
            <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
              Tổng Quan Tiến Độ Lớp Học - {courseName}
            </Typography>
          </Grid>
          <Grid item>
            <Tooltip title="Chọn lớp">
              <Button
                variant="contained"
                color="secondary"
                size="small"
                onClick={handleOpenDialog}
                startIcon={!isMobile && <ClassIcon />}
              >
                {isMobile ? <ClassIcon /> : 'Chọn lớp'}
              </Button>
            </Tooltip>
          </Grid>
          <Grid item>
            <Tooltip title="Quay lại Dashboard">
              <Button
                variant="outlined"
                color="inherit"
                size="small"
                onClick={handleBackToDashboard}
                startIcon={!isMobile && <DashboardIcon />}
                sx={{
                  borderColor: 'rgba(255,255,255,0.7)',
                  color: 'white',
                }}
              >
                {isMobile ? <DashboardIcon /> : 'Quay lại Dashboard'}
              </Button>
            </Tooltip>
          </Grid>
        </Grid>
      </Paper>

      {/* Thông tin lớp học */}
      <Paper sx={{ p: 2, mt: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs>
            <Typography variant="subtitle1" component="div">
              {courseName} - {semesterName}
            </Typography>
            {classInfo && (
              <>
                <Typography variant="body2" color="textSecondary">
                  Giảng viên: {classInfo.instructor.title} {classInfo.instructor.name}
                </Typography>
                {classInfo.assistant && (
                  <Typography variant="body2" color="textSecondary">
                    Trợ giảng: {classInfo.assistant.title} {classInfo.assistant.name}
                  </Typography>
                )}
              </>
            )}
          </Grid>
          <Grid item>
            <Tooltip title="Xuất báo cáo Excel">
              <Button
                variant="contained"
                color="success"
                size="small"
                startIcon={!isMobile && <FileDownloadIcon />}
                onClick={handleExportToExcel}
                disabled={isExporting}
              >
                {isMobile ? <FileDownloadIcon /> : isExporting ? 'Đang xuất...' : 'Xuất báo cáo'}
              </Button>
            </Tooltip>
          </Grid>
        </Grid>
      </Paper>

      {/* Dialog chọn lớp */}
      <CDashboardDialog open={openDialog} onClose={handleCloseDialog} />

      {/* Thông báo kết quả xuất Excel */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CDashboardHeader;