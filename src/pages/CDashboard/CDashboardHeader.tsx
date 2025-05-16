import React, { useState } from 'react';
import {
  Paper, Grid, Typography, Button, Box, Tooltip, useMediaQuery, useTheme
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
  selectSemesterOptions
} from '@/redux/slices/teacherDashboardSlice';

const CDashboardHeader = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Get data from Redux store
  const classInfo = useSelector(selectClassInfo);
  const currentCourse = useSelector(selectCurrentCourse);
  const currentSemester = useSelector(selectCurrentSemester);
  const courseOptions = useSelector(selectCourseOptions);
  const semesterOptions = useSelector(selectSemesterOptions);

  // Find current course and semester names
  const currentCourseObj = courseOptions.find(course => course.id === currentCourse);
  const currentSemesterObj = semesterOptions.find(semester => semester.id === currentSemester);

  const courseName = currentCourseObj?.fullName || 'Unknown Course';
  const semesterName = currentSemesterObj?.name || 'Unknown Semester';

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);
  const handleBackToDashboard = () => navigate('/trang-chu');

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
              Lớp {currentCourse} - {semesterName}
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
            <Tooltip title="Xuất báo cáo">
              <Button
                variant="contained"
                color="success"
                size="small"
                startIcon={!isMobile && <FileDownloadIcon />}
              >
                {isMobile ? <FileDownloadIcon /> : 'Xuất báo cáo'}
              </Button>
            </Tooltip>
          </Grid>
        </Grid>
      </Paper>

      {/* Dialog chọn lớp */}
      <CDashboardDialog open={openDialog} onClose={handleCloseDialog} />
    </Box>
  );
};

export default CDashboardHeader;