// src/features/chat/components/ChatHeader.tsx
import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Switch,
  FormControlLabel,
  useTheme
} from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import SettingsIcon from '@mui/icons-material/Settings';
import { styled } from '@mui/material/styles';

interface ChatHeaderProps {
  title: string;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onOpenSettings?: () => void;
}

const HeaderToolbar = styled(Toolbar)(({ theme }) => ({
  minHeight: '48px',
  padding: theme.spacing(0, 2),
  display: 'flex',
  justifyContent: 'space-between',
}));

const Title = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
}));

const ThemeToggleContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
}));

const ChatHeader: React.FC<ChatHeaderProps> = ({
                                                 title,
                                                 isDarkMode,
                                                 onToggleTheme,
                                                 onOpenSettings
                                               }) => {
  const theme = useTheme();

  return (
    <AppBar
      position="sticky"
      color="default"
      elevation={0}
      sx={{
        borderBottom: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <HeaderToolbar>
        <Title variant="h6" component="div">
          {title}
        </Title>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <ThemeToggleContainer>
            <LightModeIcon fontSize="small" sx={{ color: isDarkMode ? 'text.disabled' : 'warning.main' }} />
            <Switch
              size="small"
              checked={isDarkMode}
              onChange={onToggleTheme}
              color="primary"
            />
            <DarkModeIcon fontSize="small" sx={{ color: isDarkMode ? 'info.main' : 'text.disabled' }} />
          </ThemeToggleContainer>

          {onOpenSettings && (
            <IconButton
              size="small"
              onClick={onOpenSettings}
              sx={{ ml: 1 }}
            >
              <SettingsIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      </HeaderToolbar>
    </AppBar>
  );
};

export default ChatHeader;