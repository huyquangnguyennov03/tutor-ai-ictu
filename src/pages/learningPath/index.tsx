import React, { useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  Button,
  Tabs,
  Tab,
  Grid,
  LinearProgress,
  Chip,
  Stack
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Book, Layers, Code, School } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { createSlice, configureStore, PayloadAction } from '@reduxjs/toolkit';

// Define types
interface Course {
  id: string;
  title: string;
  description: string;
  completedModules: number;
  totalModules: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: number;
  icon: 'book' | 'layers' | 'code' | 'school';
}

interface CourseState {
  courses: Course[];
}

// Create Redux slice
const courseSlice = createSlice({
  name: 'courses',
  initialState: {
    courses: [
      {
        id: '1',
        title: 'Introduction to Programming',
        description: 'Learn the basics of programming with JavaScript',
        completedModules: 6,
        totalModules: 8,
        level: 'Beginner',
        duration: 4,
        icon: 'code'
      },
      {
        id: '2',
        title: 'Web Development Fundamentals',
        description: 'HTML, CSS, and JavaScript for building websites',
        completedModules: 4,
        totalModules: 10,
        level: 'Intermediate',
        duration: 6,
        icon: 'book'
      },
      {
        id: '3',
        title: 'Advanced React Development',
        description: 'Build complex applications with React and Redux',
        completedModules: 1,
        totalModules: 12,
        level: 'Advanced',
        duration: 8,
        icon: 'layers'
      },
      {
        id: '4',
        title: 'Data Structures and Algorithms',
        description: 'Essential knowledge for computer science',
        completedModules: 0,
        totalModules: 15,
        level: 'Advanced',
        duration: 10,
        icon: 'school'
      }
    ] as Course[]
  } as CourseState,
  reducers: {
    updateCourseProgress: (state, action: PayloadAction<{ id: string, completedModules: number }>) => {
      const course = state.courses.find(c => c.id === action.payload.id);
      if (course) {
        course.completedModules = action.payload.completedModules;
      }
    }
  }
});

// Create store
const store = configureStore({
  reducer: {
    courses: courseSlice.reducer
  }
});

// Export actions
export const { updateCourseProgress } = courseSlice.actions;

// Define types for Redux store
type RootState = ReturnType<typeof store.getState>;

// Create a custom theme with blue primary color similar to the screenshots
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Matching the blue in screenshots
    },
  },
  components: {
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          height: 8,
          borderRadius: 4,
        },
        bar: {
          borderRadius: 4,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: 0,
          fontSize: '1rem',
          padding: '12px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          overflow: 'hidden',
        },
      },
    },
  },
});

// Progress Bar Component
const ProgressBar: React.FC<{ value: number }> = ({ value }) => {
  return (
    <LinearProgress
      variant="determinate"
      value={value}
      sx={{
        height: 8,
        borderRadius: 4,
        backgroundColor: '#e0e0e0'
      }}
    />
  );
};

// Course Card Component
const CourseCard: React.FC<{ course: Course }> = ({ course }) => {
  const progress = (course.completedModules / course.totalModules) * 100;
  const dispatch = useDispatch();

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
    // If you want to implement this functionality
    console.log(`Continuing course: ${course.title}`);
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
            {course.completedModules} of {course.totalModules} modules completed
          </Typography>
          <Typography variant="body2" fontWeight="medium">
            {progress.toFixed(0)}%
          </Typography>
        </Box>

        <ProgressBar value={progress} />

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
            label={`${course.duration} weeks`}
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
        onClick={handleContinueClick}
        sx={{
          mt: 'auto',
          py: 1.5,
          borderRadius: 0
        }}
      >
        {course.completedModules > 0 ? 'Continue Learning' : 'Start Learning'}
      </Button>
    </Card>
  );
};

// Tab Panel Component
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

// Main Component
const LearningDashboard: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const { courses } = useSelector((state: RootState) => state.courses);

  // Filter courses based on tab
  const inProgressCourses = courses.filter(course => course.completedModules > 0);
  const allCourses = courses;

  // For simplicity, recommended courses are those with less than 30% completion
  const recommendedCourses = courses.filter(course =>
    course.completedModules === 0 ||
    (course.completedModules / course.totalModules) < 0.3
  );

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box mb={2}>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Learning Path
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Track your learning progress and discover new courses
          </Typography>
        </Box>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 4 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="course tabs"
            TabIndicatorProps={{
              style: {
                display: 'none',
              }
            }}
            sx={{
              '& .MuiTab-root': {
                px: 3,
                py: 1,
                minWidth: 'auto',
                textTransform: 'none',
                fontWeight: 500,
                fontSize: '0.875rem',
                '&.Mui-selected': {
                  color: 'primary.main',
                  bgcolor: 'rgba(25, 118, 210, 0.08)',
                  borderRadius: '4px 4px 0 0',
                },
              },
            }}
          >
            <Tab label="In Progress" disableRipple />
            <Tab label="Recommended" disableRipple />
            <Tab label="All Courses" disableRipple />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            {inProgressCourses.map((course) => (
              <Grid item xs={12} sm={6} md={4} key={course.id}>
                <CourseCard course={course} />
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            {recommendedCourses.map((course) => (
              <Grid item xs={12} sm={6} md={4} key={course.id}>
                <CourseCard course={course} />
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            {allCourses.map((course) => (
              <Grid item xs={12} sm={6} md={4} key={course.id}>
                <CourseCard course={course} />
              </Grid>
            ))}
          </Grid>
        </TabPanel>
      </Container>
    </ThemeProvider>
  );
};

// Provider wrapping for the app
const App: React.FC = () => {
  return (
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <LearningDashboard />
      </ThemeProvider>
    </React.StrictMode>
  );
};
