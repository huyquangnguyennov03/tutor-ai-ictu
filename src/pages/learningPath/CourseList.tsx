// src/pages/learningPath/CourseList.tsx
import React from 'react';
import { Grid, Typography, Box, Paper, CircularProgress } from '@mui/material';
import CourseCard from './CourseCard';
import { Course } from '@/mockData/mockLearningPath';

interface CourseListProps {
  courses: Course[];
  loading: boolean;
  emptyMessage: string;
}

const CourseList: React.FC<CourseListProps> = ({ courses, loading, emptyMessage }) => {
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (courses.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          {emptyMessage}
        </Typography>
      </Paper>
    );
  }

  return (
    <Grid container spacing={3}>
      {courses.map((course) => (
        <Grid item xs={12} sm={6} md={4} key={course.id}>
          <CourseCard course={course} />
        </Grid>
      ))}
    </Grid>
  );
};

export default CourseList;