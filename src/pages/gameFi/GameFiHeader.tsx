// src/pages/gameFi/GameFiHeader.tsx
import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Chip,
  Badge,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { styled } from '@mui/material/styles';

// Styled components
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
}));

const LevelChip = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  color: theme.palette.secondary.contrastText,
  fontWeight: 'bold',
  '& .MuiChip-label': {
    padding: '0 10px',
  }
}));

const TokenChip = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.warning.light,
  color: theme.palette.warning.contrastText,
  fontWeight: 'bold',
  '& .MuiChip-label': {
    padding: '0 10px',
  }
}));

const GradeChip = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.success.main,
  color: theme.palette.success.contrastText,
  fontWeight: 'bold',
  '& .MuiChip-label': {
    padding: '0 10px',
  }
}));

const NotificationChip = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
  }
}));

const GameFiHeader: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <StyledAppBar position="static">
      <Toolbar>
        <Typography 
          variant={isMobile ? "h6" : "h5"} 
          component="div" 
          sx={{ 
            flexGrow: 1, 
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <span role="img" aria-label="gamepad">🎮</span> 
          EduQuest
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <LevelChip 
            label="Level 38" 
            size="medium"
          />
          <TokenChip 
            label="2450 Tokens" 
            size="medium"
          />
          <NotificationChip badgeContent={4} color="error">
            <GradeChip
              label="C"
              size="medium"
            />
          </NotificationChip>
        </Box>
      </Toolbar>
    </StyledAppBar>
  );
};

export default GameFiHeader;