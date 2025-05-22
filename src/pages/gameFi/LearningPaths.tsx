import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Chip,
  LinearProgress,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SchoolIcon from '@mui/icons-material/School';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { DifficultyLevel } from '@/mockData/mockGameFi';

// Styled components
const PathCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
  }
}));

const ProgressLabel = styled(Typography)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(0.5),
  fontWeight: 'bold',
}));

interface LearningPathsProps {
  learningPaths: any[];
  onJoinLearningPath: (pathId: string) => void;
}

const LearningPaths: React.FC<LearningPathsProps> = ({ learningPaths, onJoinLearningPath }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Get difficulty color
  const getDifficultyColor = (difficulty: DifficultyLevel) => {
    switch (difficulty) {
      case DifficultyLevel.BEGINNER:
        return theme.palette.success.main;
      case DifficultyLevel.INTERMEDIATE:
        return theme.palette.info.main;
      case DifficultyLevel.ADVANCED:
        return theme.palette.warning.main;
      case DifficultyLevel.EXPERT:
        return theme.palette.error.main;
      default:
        return theme.palette.primary.main;
    }
  };
  
  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
        Learning Paths
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Follow structured learning paths to master specific skills and earn special rewards.
      </Typography>
      
      <Grid container spacing={3}>
        {learningPaths.map((path) => (
          <Grid item xs={12} md={6} key={path.id}>
            <PathCard>
              <CardMedia
                component="img"
                height="160"
                image={path.imageUrl || 'https://via.placeholder.com/600x160?text=Learning+Path'}
                alt={path.title}
              />
              
              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                    {path.title}
                  </Typography>
                  
                  <Chip
                    label={path.level}
                    size="small"
                    sx={{
                      backgroundColor: getDifficultyColor(path.level),
                      color: 'white',
                      fontWeight: 'bold',
                    }}
                  />
                </Box>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {path.description}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AccessTimeIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
                    {path.estimatedTime}
                  </Typography>
                  
                  <SchoolIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {path.totalGames} games
                  </Typography>
                </Box>
                
                <Box sx={{ width: '100%', mb: 2 }}>
                  <ProgressLabel variant="body2">
                    <span>Progress</span>
                    <span>{path.completedGames}/{path.totalGames} games</span>
                  </ProgressLabel>
                  <LinearProgress 
                    variant="determinate" 
                    value={path.progress} 
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Included Games:
                </Typography>
                
                <List dense sx={{ mb: 2 }}>
                  {path.games.map((gameId: string, index: number) => (
                    <ListItem key={gameId} disablePadding>
                      <ListItemIcon sx={{ minWidth: 30 }}>
                        {index < path.completedGames ? (
                          <CheckCircleIcon color="success" fontSize="small" />
                        ) : (
                          <RadioButtonUncheckedIcon color="disabled" fontSize="small" />
                        )}
                      </ListItemIcon>
                      <ListItemText 
                        primary={`Game ${index + 1}`} 
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                  ))}
                  {path.totalGames > path.games.length && (
                    <ListItem disablePadding>
                      <ListItemIcon sx={{ minWidth: 30 }}>
                        <RadioButtonUncheckedIcon color="disabled" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={`+ ${path.totalGames - path.games.length} more games`} 
                        primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                      />
                    </ListItem>
                  )}
                </List>
                
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => onJoinLearningPath(path.id)}
                  sx={{ mt: 'auto' }}
                >
                  {path.progress > 0 ? 'Continue Path' : 'Join Path'}
                </Button>
              </CardContent>
            </PathCard>
          </Grid>
        ))}
      </Grid>
      
      {learningPaths.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No learning paths available at the moment.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Check back later for new learning paths!
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default LearningPaths;