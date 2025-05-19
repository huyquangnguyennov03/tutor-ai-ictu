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
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid rgba(0, 0, 0, 0.12)',
        borderRadius: 2,
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)'
      }}
    >
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
          <Typography variant="h6" component="h2" fontWeight="bold">
            {course.title}
          </Typography>
          {getIconComponent(course.icon)}
        </Box>

        <Typography variant="body2" color="text.secondary" mb={2}>
          {course.description}
        </Typography>

        <Box display="flex" flexDirection="column" mb={1}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
            <Typography variant="body2" color="text.secondary">
              {course.completedModules} of {course.totalModules} modules completed
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              {progress.toFixed(0)}%
            </Typography>
          </Box>

          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 6,
              borderRadius: 3,
              backgroundColor: '#e0e0e0',
              '& .MuiLinearProgress-bar': {
                backgroundColor: '#2962ff'
              }
            }}
          />
        </Box>

        <Box display="flex" gap={1} mt={2}>
          <Chip
            label={course.level}
            size="small"
            sx={{
              bgcolor: course.level === 'Beginner' ? 'rgba(46, 125, 50, 0.1)' : 'rgba(25, 118, 210, 0.1)',
              color: course.level === 'Beginner' ? 'rgb(46, 125, 50)' : 'rgb(25, 118, 210)',
              fontWeight: 500,
              fontSize: '0.75rem',
              height: '24px'
            }}
          />
          <Chip
            label={`${course.duration} weeks`}
            size="small"
            variant="outlined"
            sx={{
              fontSize: '0.75rem',
              fontWeight: 500,
              height: '24px'
            }}
          />
        </Box>
      </CardContent>

      <Box px={3} pb={3} width="100%">
        <Button
          fullWidth
          variant="contained"
          disableElevation
          onClick={course.isEnrolled ? handleContinueClick : handleEnrollClick}
          sx={{
            py: 1.5,
            borderRadius: 1.5,
            backgroundColor: '#2962ff',
            textTransform: 'none',
            fontWeight: 500
          }}
        >
          {!course.isEnrolled
            ? 'Enroll Course'
            : course.completedModules > 0
              ? 'Continue Learning'
              : 'Start Learning'}
        </Button>
      </Box>
    </Card>
  );
};

export default CourseCard;