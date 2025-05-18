// src/pages/chatTutor/ChatMessage.tsx
import React from 'react';
import { Box, Typography, Paper, Avatar, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import { Message } from '@/redux/slices/chatTutorSlice';

interface ChatMessageProps {
  message: Message;
}

// Styled components
const UserMessagePaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  borderRadius: '18px 18px 0 18px',
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.primary.contrastText,
  maxWidth: '80%',
  marginLeft: 'auto',
  boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
}));

const AIMessagePaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  borderRadius: '18px 18px 18px 0',
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  maxWidth: '80%',
  boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
}));

const MessageContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  marginBottom: theme.spacing(2),
  alignItems: 'flex-start',
}));

const MessageAvatar = styled(Avatar)(({ theme }) => ({
  marginRight: theme.spacing(1),
  marginTop: theme.spacing(0.5),
  backgroundColor: theme.palette.primary.main
}));

const UserAvatar = styled(Avatar)(({ theme }) => ({
  marginLeft: theme.spacing(1),
  marginTop: theme.spacing(0.5),
  backgroundColor: theme.palette.secondary.main
}));

const MessageTime = styled(Typography)(({ theme }) => ({
  fontSize: '0.7rem',
  color: theme.palette.text.secondary,
  marginTop: theme.spacing(0.5),
  textAlign: 'right',
}));

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const { content, sender, timestamp } = message;
  
  // Format timestamp
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (sender === 'user') {
    return (
      <MessageContainer>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', maxWidth: '80%' }}>
          <UserMessagePaper elevation={0}>
            <Typography variant="body1">{content}</Typography>
          </UserMessagePaper>
          <MessageTime>{formatTime(timestamp)}</MessageTime>
        </Box>
        <Tooltip title="Bạn" placement="left">
          <UserAvatar>
            <PersonIcon />
          </UserAvatar>
        </Tooltip>
      </MessageContainer>
    );
  }

  return (
    <MessageContainer>
      <Tooltip title="Trợ lý AI" placement="right">
        <MessageAvatar>
          <SmartToyIcon />
        </MessageAvatar>
      </Tooltip>
      <Box sx={{ display: 'flex', flexDirection: 'column', maxWidth: '80%' }}>
        <AIMessagePaper elevation={0}>
          <Typography
            variant="body1"
            sx={{ 
              '& code': { 
                backgroundColor: (theme) => theme.palette.action.hover,
                padding: '2px 4px',
                borderRadius: '4px',
                fontFamily: 'monospace'
              }
            }}
            dangerouslySetInnerHTML={{ 
              __html: content
                .replace(/\n/g, '<br/>')
                // Highlight code blocks with backticks
                .replace(/`([^`]+)`/g, '<code>$1</code>')
            }}
          />
        </AIMessagePaper>
        <MessageTime>{formatTime(timestamp)}</MessageTime>
      </Box>
    </MessageContainer>
  );
};

export default ChatMessage;