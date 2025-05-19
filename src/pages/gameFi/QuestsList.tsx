// src/pages/gameFi/components/QuestsList.tsx
import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  LinearProgress,
  Grid,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import StarIcon from '@mui/icons-material/Star';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import { Quest, TokenType } from '@/mockData/mockGameFi';

// Styled components
const QuestCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
  }
}));

const QuestProgress = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(1),
}));

const RewardChip = styled(Chip)(({ theme, tokentype }: { theme: any, tokentype: TokenType }) => {
  let color;
  switch (tokentype) {
    case TokenType.KNOWLEDGE_TOKEN:
      color = theme.palette.warning.main;
      break;
    case TokenType.SKILL_POINT:
      color = theme.palette.info.main;
      break;
    case TokenType.EXPERIENCE_POINT:
      color = theme.palette.success.main;
      break;
    case TokenType.ACHIEVEMENT_BADGE:
      color = theme.palette.secondary.main;
      break;
    default:
      color = theme.palette.primary.main;
  }
  
  return {
    backgroundColor: color,
    color: '#fff',
    fontWeight: 'bold',
  };
});

interface QuestsListProps {
  quests: Quest[];
  onStartQuest: (questId: string) => void;
}

const QuestsList: React.FC<QuestsListProps> = ({ quests, onStartQuest }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Format deadline date
  const formatDeadline = (dateString: string) => {
    const deadline = new Date(dateString);
    const now = new Date();
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 0) {
      return 'Expired';
    } else if (diffDays === 1) {
      return 'Today';
    } else if (diffDays <= 7) {
      return `${diffDays} days left`;
    } else {
      return deadline.toLocaleDateString();
    }
  };
  
  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
        Available Quests
      </Typography>
      
      <Grid container spacing={3}>
        {quests.map((quest) => (
          <Grid item xs={12} md={6} key={quest.id}>
            <QuestCard>
              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                    {quest.title}
                  </Typography>
                  
                  <Chip
                    icon={<AccessTimeIcon />}
                    label={formatDeadline(quest.deadline)}
                    size="small"
                    color={
                      new Date(quest.deadline).getTime() - new Date().getTime() < 2 * 24 * 60 * 60 * 1000
                        ? 'error'
                        : 'default'
                    }
                  />
                </Box>
                
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
                  {quest.description}
                </Typography>
                
                <QuestProgress>
                  <Box sx={{ flexGrow: 1, mr: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2" color="text.secondary">
                        Progress
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {quest.progress}%
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={quest.progress} 
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                  
                  {quest.isCompleted ? (
                    <CheckCircleIcon color="success" />
                  ) : (
                    <HourglassEmptyIcon color="action" />
                  )}
                </QuestProgress>
                
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Rewards:
                </Typography>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  <Chip
                    icon={<StarIcon />}
                    label={`${quest.xpReward} XP`}
                    size="small"
                    sx={{ backgroundColor: theme.palette.success.light, color: theme.palette.success.contrastText }}
                  />
                  
                  {quest.rewards.map((reward) => (
                    <RewardChip
                      key={reward.id}
                      label={`${reward.amount} ${reward.name}`}
                      size="small"
                      tokentype={reward.tokenType}
                    />
                  ))}
                </Box>
                
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Required Games:
                </Typography>
                
                <List dense sx={{ bgcolor: 'background.paper', borderRadius: 1, mb: 2 }}>
                  {quest.games.map((gameId, index) => (
                    <ListItem key={gameId}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                          {index + 1}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText 
                        primary={`Game ${index + 1}`} 
                        secondary={quest.progress > index * (100 / quest.games.length) ? "Completed" : "Not started"}
                      />
                    </ListItem>
                  ))}
                </List>
                
                <Box sx={{ mt: 'auto' }}>
                  <Button
                    variant="contained"
                    fullWidth
                    disabled={quest.isCompleted}
                    onClick={() => onStartQuest(quest.id)}
                    sx={{ mt: 1 }}
                  >
                    {quest.isCompleted ? 'Completed' : quest.progress > 0 ? 'Continue Quest' : 'Start Quest'}
                  </Button>
                </Box>
              </CardContent>
            </QuestCard>
          </Grid>
        ))}
      </Grid>
      
      {quests.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No quests available at the moment.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Check back later for new quests!
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default QuestsList;