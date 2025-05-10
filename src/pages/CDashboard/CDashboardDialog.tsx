import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  Select,
  MenuItem,
  IconButton,
  Typography,
  Box,
  SelectChangeEvent
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch, useSelector } from 'react-redux';
import {
  setCurrentCourse,
  setCurrentSemester,
  fetchDashboardData,
  selectCourseOptions,
  selectSemesterOptions,
  selectCurrentCourse,
  selectCurrentSemester
} from '@/redux/slices/teacherDashboardSlice';
import { AppDispatch } from '@/redux/store'; // Bạn cần import AppDispatch từ store

interface CDashboardDialogProps {
  open: boolean;
  onClose: () => void;
}

const CDashboardDialog: React.FC<CDashboardDialogProps> = ({ open, onClose }) => {
  // Sử dụng AppDispatch thay vì dispatch thông thường
  const dispatch = useDispatch<AppDispatch>();

  // Get data from Redux store
  const courseOptions = useSelector(selectCourseOptions);
  const semesterOptions = useSelector(selectSemesterOptions);
  const currentCourse = useSelector(selectCurrentCourse);
  const currentSemester = useSelector(selectCurrentSemester);

  // Find the current course's full display name
  const currentCourseObj = courseOptions.find(course => course.id === currentCourse);
  const selectedClass = currentCourseObj ? `${currentCourseObj.fullName} - ${currentCourseObj.id}` : '';

  const handleClassChange = (event: SelectChangeEvent) => {
    // Extract course ID from selection (e.g., "C Programming - C01" -> "C01")
    const courseId = event.target.value.split(' - ')[1];
    if (courseId) {
      dispatch(setCurrentCourse(courseId));
    }
  };

  const handleSemesterChange = (event: SelectChangeEvent) => {
    dispatch(setCurrentSemester(event.target.value));
  };

  const handleConfirm = () => {
    // Fetch dashboard data with the selected course and semester
    dispatch(fetchDashboardData({
      courseId: currentCourse,
      semesterId: currentSemester
    }));

    // Close dialog
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: '450px',
          maxWidth: '90vw',
          borderRadius: 1,
          paddingBottom: 1
        }
      }}
    >
      <DialogTitle sx={{
        borderBottom: '1px solid #eaeaea',
        padding: 2,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'medium', color: '#4d6082' }}>
          Chọn lớp học
        </Typography>
        <IconButton aria-label="close" onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ padding: 3, paddingBottom: 1 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Lớp học:
          </Typography>
          <FormControl fullWidth>
            <Select
              value={selectedClass}
              onChange={handleClassChange}
              displayEmpty
              inputProps={{ 'aria-label': 'Without label' }}
            >
              {courseOptions.map((course) => (
                <MenuItem key={course.id} value={`${course.fullName} - ${course.id}`}>
                  {course.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Học kỳ:
          </Typography>
          <FormControl fullWidth>
            <Select
              value={currentSemester}
              onChange={handleSemesterChange}
              displayEmpty
              inputProps={{ 'aria-label': 'Without label' }}
            >
              {semesterOptions.map((semester) => (
                <MenuItem key={semester.id} value={semester.id}>{semester.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>

      <DialogActions sx={{ padding: 2, justifyContent: 'flex-end' }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderRadius: 1,
            textTransform: 'none',
            minWidth: '80px',
            backgroundColor: '#f2f2f2',
            borderColor: '#d9d9d9',
            color: '#333',
            '&:hover': {
              backgroundColor: '#e6e6e6',
              borderColor: '#bfbfbf'
            }
          }}
        >
          Hủy
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color="success"
          sx={{
            borderRadius: 1,
            textTransform: 'none',
            minWidth: '80px',
            backgroundColor: '#4CAF50'
          }}
        >
          Xác nhận
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CDashboardDialog;