// src/pages/gameFi/components/UserProfile.tsx
import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Avatar,
  LinearProgress,
  Divider,
  Chip,
  Grid,
  Tooltip,
  Badge
} from '@mui/material';
import { styled } from '@mui/material/styles';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { GameFiProfile } from '@/mockData/mockGameFi';

// Styled components
const ProfilePaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
  background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 100,
  height: 100,
  border: `4px solid ${theme.palette.primary.main}`,
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)',
}));

const ProgressLabel = styled(Typography)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(0.5),
  fontWeight: 'bold',
}));

const StatBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
}));

const StatValue = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  fontSize: '1.2rem',
  color: theme.palette.primary.main,
}));

const StatLabel = styled(Typography)(({ theme }) => ({
  fontSize: '0.75rem',
  color: theme.palette.text.secondary,
}));

const BadgeContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  marginTop: theme.spacing(2),
  flexWrap: 'wrap',
}));

interface UserProfileProps {
  profile: GameFiProfile | null;
}

const UserProfile: React.FC<UserProfileProps> = ({ profile }) => {
  if (!profile) {
    return (
      <ProfilePaper>
        <Typography variant="body1">Loading profile...</Typography>
      </ProfilePaper>
    );
  }

  // Calculate XP progress percentage
  const xpProgress = Math.min(100, (profile.xp / (profile.xp + profile.xpToNextLevel)) * 100);

  return (
    <ProfilePaper>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          badgeContent={
            <Tooltip title={`Level ${profile.level}`}>
              <Chip
                label={profile.level}
                color="primary"
                size="small"
                sx={{ 
                  height: 24, 
                  minWidth: 24, 
                  fontWeight: 'bold',
                  fontSize: '0.75rem'
                }}
              />
            </Tooltip>
          }
        >
          <StyledAvatar src={profile.avatarUrl} alt={profile.username} />
        </Badge>

        <Typography variant="h5" sx={{ mt: 2, fontWeight: 'bold' }}>
          {profile.username}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
          <Tooltip title="Current streak">
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
              <LocalFireDepartmentIcon color="error" fontSize="small" />
              <Typography variant="body2" sx={{ ml: 0.5 }}>
                {profile.streak} days
              </Typography>
            </Box>
          </Tooltip>

          <Tooltip title="Rank">
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <EmojiEventsIcon color="warning" fontSize="small" />
              <Typography variant="body2" sx={{ ml: 0.5 }}>
                #{profile.rank}
              </Typography>
            </Box>
          </Tooltip>
        </Box>

        <Box sx={{ width: '100%', mt: 3 }}>
          <ProgressLabel variant="body2">
            <span>XP: {profile.xp}</span>
            <span>Next Level: {profile.xp + profile.xpToNextLevel}</span>
          </ProgressLabel>
          <LinearProgress 
            variant="determinate" 
            value={xpProgress} 
            sx={{ 
              height: 8, 
              borderRadius: 4,
              mb: 1
            }} 
          />
        </Box>

        <Divider sx={{ width: '100%', my: 2 }} />

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <StatBox>
              <StatValue>{profile.knowledgeTokens}</StatValue>
              <StatLabel>Knowledge Tokens</StatLabel>
            </StatBox>
          </Grid>
          <Grid item xs={6}>
            <StatBox>
              <StatValue>{profile.skillPoints}</StatValue>
              <StatLabel>Skill Points</StatLabel>
            </StatBox>
          </Grid>
          <Grid item xs={6}>
            <StatBox>
              <StatValue>{profile.completedGames}</StatValue>
              <StatLabel>Games Completed</StatLabel>
            </StatBox>
          </Grid>
          <Grid item xs={6}>
            <StatBox>
              <StatValue>{profile.completedQuests}</StatValue>
              <StatLabel>Quests Completed</StatLabel>
            </StatBox>
          </Grid>
        </Grid>

        <Divider sx={{ width: '100%', my: 2 }} />

        <Typography variant="subtitle1" sx={{ alignSelf: 'flex-start', fontWeight: 'bold' }}>
          Badges Earned ({profile.badges.length})
        </Typography>

        <BadgeContainer>
          {profile.badges.map((badge) => (
            <Tooltip key={badge.id} title={badge.name}>
              <Avatar 
                src={badge.imageUrl} 
                alt={badge.name}
                sx={{ 
                  width: 40, 
                  height: 40,
                  border: '2px solid gold'
                }}
              />
            </Tooltip>
          ))}
        </BadgeContainer>
      </Box>
    </ProfilePaper>
  );
};

export default UserProfile;