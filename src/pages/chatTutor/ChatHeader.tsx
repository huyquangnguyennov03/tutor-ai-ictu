// src/pages/chatTutor/ChatHeader.tsx
import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  useTheme
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import { styled } from '@mui/material/styles';

interface ChatHeaderProps {
  title: string;
  onOpenSettings?: () => void;
  leftComponent?: React.ReactNode;
}

const HeaderToolbar = styled(Toolbar)(({ theme }) => ({
  minHeight: '48px',
  padding: theme.spacing(0, 2),
  display: 'flex',
  justifyContent: 'space-between',
}));

const Title = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  flexGrow: 1,
  textAlign: 'center',
}));

const ChatHeader: React.FC<ChatHeaderProps> = ({
                                                 title,
                                                 onOpenSettings,
                                                 leftComponent
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
        width: '100%',
      }}
    >
      <HeaderToolbar>
        {leftComponent &&
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {leftComponent}
          </Box>
        }
        <Title variant="h6" component="div">
          {title}
        </Title>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {onOpenSettings && (
            <IconButton
              size="small"
              onClick={onOpenSettings}
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