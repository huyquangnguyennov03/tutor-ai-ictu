// src/pages/learningPath/CourseCard.tsx
import React from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import {
  selectCourse,
  fetchCourseDetailsAsync,
  enrollCourseAsync
} from '@/redux/slices/learningPathSlice';
import { Course } from '@/mockData/mockLearningPath';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Stack,
  LinearProgress
} from '@mui/material';
import { Book, Layers, Code, School } from '@mui/icons-material';

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const dispatch = useDispatch<AppDispatch>();
  const progress = (course.completedModules / course.totalModules) * 100;

  const getIconComponent = (iconType: string) => {
    switch(iconType) {
      case 'book':
        return <Book color="primary" fontSize="large" />;
      case 'layers':
        return <Layers color="primary" fontSize="large" />;
      case 'code':
        return <Code color="primary" fontSize="large" />;
      case 'school':
        return <School color="primary" fontSize="large" />;
      default:
        return <Book color="primary" fontSize="large" />;
    }
  };

  const getLevelColor = (level: string) => {
    switch(level) {
      case 'Beginner':
        return {
          bgcolor: 'rgba(46, 125, 50, 0.1)',
          color: 'rgb(46, 125, 50)'
        };
      case 'Intermediate':
        return {
          bgcolor: 'rgba(25, 118, 210, 0.1)',
          color: 'rgb(25, 118, 210)'
        };
      case 'Advanced':
        return {
          bgcolor: 'rgba(237, 108, 2, 0.1)',
          color: 'rgb(237, 108, 2)'
        };
      default:
        return {
          bgcolor: 'rgba(97, 97, 97, 0.1)',
          color: 'rgb(97, 97, 97)'
        };
    }
  };

  const handleContinueClick = () => {
    dispatch(selectCourse(course.id));
    dispatch(fetchCourseDetailsAsync(course.id));
    // Trong ứng dụng thực tế, có thể chuyển hướng đến trang chi tiết khóa học
    // navigate(`/learning-path/courses/${course.id}`);
  };

  const handleEnrollClick = () => {
    dispatch(enrollCourseAsync(course.id));
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', border: '1px solid rgba(0, 0, 0, 0.12)' }}>
      <CardContent sx={{ flexGrow: 1, pb: 0 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Typography variant="h6" component="h2" fontWeight="bold">
            {course.title}
          </Typography>
          {getIconComponent(course.icon)}
        </Box>

        <Typography variant="body2" color="text.secondary" mb={2}>
          {course.description}
        </Typography>

        <Box mb={0.5} display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="body2" color="text.secondary">
            {course.completedModules} / {course.totalModules} bài học đã hoàn thành
          </Typography>
          <Typography variant="body2" fontWeight="medium">
            {progress.toFixed(0)}%
          </Typography>
        </Box>

        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 8,
            borderRadius: 4,
            backgroundColor: '#e0e0e0'
          }}
        />

        <Stack direction="row" spacing={1} mt={3} mb={2}>
          <Chip
            label={course.level}
            size="small"
            sx={{
              ...getLevelColor(course.level),
              fontWeight: 500,
              fontSize: '0.75rem',
            }}
          />
          <Chip
            label={`${course.duration} tuần`}
            size="small"
            variant="outlined"
            sx={{
              fontSize: '0.75rem',
              fontWeight: 500,
            }}
          />
        </Stack>
      </CardContent>

      <Button
        fullWidth
        variant="contained"
        disableElevation
        onClick={course.isEnrolled ? handleContinueClick : handleEnrollClick}
        sx={{
          mt: 'auto',
          py: 1.5,
          borderRadius: 0
        }}
      >
        {!course.isEnrolled 
          ? 'Đăng ký khóa học' 
          : course.completedModules > 0 
            ? 'Tiếp tục học' 
            : 'Bắt đầu học'}
      </Button>
    </Card>
  );
};

export default CourseCard;