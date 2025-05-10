import React, { useState } from 'react';
import { Paper, Grid, Typography, Button, Box } from '@mui/material';
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
      <Paper sx={{ p: 2, backgroundColor: '#f5f5f5' }}>
        <Grid container alignItems="center">
          <Grid item xs>
            <Typography variant="h6" component="div">
              Tổng Quan Tiến Độ Lớp Học - {courseName}
            </Typography>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              size="small"
              sx={{ mr: 1 }}
              onClick={handleOpenDialog}
            >
              Chọn lớp
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={handleBackToDashboard}
            >
              Quay lại Dashboard
            </Button>
          </Grid>
        </Grid>
      </Paper>

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
            <Button variant="contained" color="success" size="small">
              Xuất báo cáo
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Dialog component */}
      <CDashboardDialog open={openDialog} onClose={handleCloseDialog} />
    </Box>
  );
};

export default CDashboardHeader;