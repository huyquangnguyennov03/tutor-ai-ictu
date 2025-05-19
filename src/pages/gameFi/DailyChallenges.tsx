// src/pages/gameFi/components/DailyChallenges.tsx
import React from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Button,
  Divider,
  LinearProgress,
  useTheme
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { DifficultyLevel } from '@/mockData/mockGameFi';

// Styled components
const ChallengesPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
  background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
}));

const ChallengeItem = styled(ListItem)(({ theme, completed }: { theme: any, completed: boolean }) => ({
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(1),
  backgroundColor: completed ? 'rgba(76, 175, 80, 0.08)' : theme.palette.background.paper,
  border: `1px solid ${completed ? theme.palette.success.light : theme.palette.divider}`,
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)',
  }
}));

interface DailyChallengesProps {
  challenges: any[];
  onStartChallenge: (challengeId: string) => void;
}

const DailyChallenges: React.FC<DailyChallengesProps> = ({ challenges, onStartChallenge }) => {
  const theme = useTheme();
  
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
  
  // Calculate completion percentage
  const completedChallenges = challenges.filter(challenge => challenge.isCompleted).length;
  const completionPercentage = (completedChallenges / challenges.length) * 100;
  
  return (
    <ChallengesPaper>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Daily Challenges
        </Typography>
        
        <Chip
          icon={<EmojiEventsIcon />}
          label={`${completedChallenges}/${challenges.length}`}
          color="primary"
          size="small"
        />
      </Box>
      
      <Box sx={{ mb: 2 }}>
        <LinearProgress 
          variant="determinate" 
          value={completionPercentage} 
          sx={{ height: 8, borderRadius: 4 }}
        />
      </Box>
      
      <List disablePadding>
        {challenges.map((challenge) => (
          <ChallengeItem key={challenge.id} completed={challenge.isCompleted}>
            <ListItemIcon>
              {challenge.isCompleted ? (
                <CheckCircleIcon color="success" />
              ) : (
                <PlayArrowIcon color="primary" />
              )}
            </ListItemIcon>
            
            <ListItemText
              primary={challenge.title}
              secondary={
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mt: 0.5 }}>
                  <Typography variant="body2" color="text.secondary">
                    {challenge.description}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                    <Chip
                      label={`${challenge.points} pts`}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                    
                    <Chip
                      label={challenge.difficulty}
                      size="small"
                      sx={{
                        backgroundColor: getDifficultyColor(challenge.difficulty),
                        color: 'white',
                        fontWeight: 'bold',
                      }}
                    />
                    
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <AccessTimeIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary">
                        {challenge.timeLimit} min
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              }
            />
            
            <Button
              variant={challenge.isCompleted ? "outlined" : "contained"}
              color={challenge.isCompleted ? "success" : "primary"}
              size="small"
              disabled={challenge.isCompleted}
              onClick={() => onStartChallenge(challenge.id)}
              sx={{ ml: 1 }}
            >
              {challenge.isCompleted ? 'Completed' : 'Start'}
            </Button>
          </ChallengeItem>
        ))}
      </List>
      
      <Divider sx={{ my: 2 }} />
      
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Complete all challenges to earn bonus rewards!
        </Typography>
        
        <Button
          variant="outlined"
          fullWidth
          disabled={completionPercentage < 100}
        >
          Claim Daily Bonus
        </Button>
      </Box>
    </ChallengesPaper>
  );
};

export default DailyChallenges;