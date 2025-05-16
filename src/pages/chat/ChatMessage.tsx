import React from 'react';
import { Box, Typography, Paper, Avatar } from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { Message } from './types';
import { format } from 'date-fns';

interface ChatMessageProps {
  message: Message;
  isCurrentUser: boolean;
  senderName?: string;
  senderAvatar?: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ 
  message, 
  isCurrentUser,
  senderName,
  senderAvatar
}) => {
  const getBackgroundColor = () => {
    switch (message.senderType) {
      case 'teacher':
        return isCurrentUser ? '#e3f2fd' : '#f1f3f4'; // Light blue for current user, light gray for others
      case 'student':
        return isCurrentUser ? '#e3f2fd' : '#f1f3f4'; // Light blue for current user, light gray for others
      case 'ai':
        return '#fef7ff'; // Light purple for AI
      default:
        return '#f5f5f5';
    }
  };

  const getBorderColor = () => {
    switch (message.senderType) {
      case 'teacher':
        return isCurrentUser ? 'rgba(25, 118, 210, 0.2)' : 'rgba(0, 0, 0, 0.08)';
      case 'student':
        return isCurrentUser ? 'rgba(25, 118, 210, 0.2)' : 'rgba(0, 0, 0, 0.08)';
      case 'ai':
        return 'rgba(156, 39, 176, 0.15)'; // Purple border
      default:
        return 'rgba(0, 0, 0, 0.05)';
    }
  };

  const getTextColor = () => {
    switch (message.senderType) {
      case 'teacher':
        return isCurrentUser ? '#1565c0' : '#37474f';
      case 'student':
        return isCurrentUser ? '#1565c0' : '#37474f';
      case 'ai':
        return '#7b1fa2'; // Purple for AI name
      default:
        return '#424242';
    }
  };

  const getInitials = (name: string = '') => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const getSenderAvatar = () => {
    if (message.senderType === 'ai') {
      return (
        <Avatar sx={{ bgcolor: '#9c27b0', width: 36, height: 36 }}>
          <SmartToyIcon fontSize="small" />
        </Avatar>
      );
    }

    if (senderAvatar) {
      return (
        <Avatar
          src={senderAvatar}
          alt={senderName}
          sx={{ width: 36, height: 36 }}
        >
          {getInitials(senderName)}
        </Avatar>
      );
    }

    return (
      <Avatar
        sx={{
          bgcolor: isCurrentUser ? '#1976d2' : '#78909c',
          width: 36,
          height: 36,
          fontSize: '0.875rem'
        }}
      >
        {getInitials(senderName || message.sender)}
      </Avatar>
    );
  };

  // Format code blocks
  const formatContent = (content: string) => {
    if (!content.includes('```')) return content;

    const parts = content.split('```');
    return parts.map((part, index) => {
      // Even indices are normal text, odd indices are code blocks
      if (index % 2 === 0) {
        return <span key={index}>{part}</span>;
      } else {
        return (
          <Box
            key={index}
            component="pre"
            sx={{
              backgroundColor: '#f5f5f5',
              borderRadius: 1,
              p: 1.5,
              my: 1,
              overflowX: 'auto',
              fontFamily: 'monospace',
              fontSize: '0.875rem',
              border: '1px solid rgba(0, 0, 0, 0.1)'
            }}
          >
            <code>{part}</code>
          </Box>
        );
      }
    });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: isCurrentUser ? 'flex-end' : 'flex-start',
        mb: 2.5,
        px: 1
      }}
    >
      {!isCurrentUser && (
        <Box sx={{ mr: 1.5, mt: 0.5 }}>
          {getSenderAvatar()}
        </Box>
      )}

      <Box sx={{ maxWidth: '75%' }}>
        {!isCurrentUser && (
          <Typography
            variant="subtitle2"
            sx={{
              mb: 0.5,
              ml: 1.5,
              color: getTextColor(),
              fontWeight: 500
            }}
          >
            {senderName || message.sender}
          </Typography>
        )}

        <Paper
          elevation={0}
          sx={{
            p: 1.5,
            borderRadius: 2,
            backgroundColor: getBackgroundColor(),
            border: `1px solid ${getBorderColor()}`,
            position: 'relative',
            '&::before': isCurrentUser ? {
              content: '""',
              position: 'absolute',
              right: '-8px',
              top: '50%',
              transform: 'translateY(-50%) rotate(45deg)',
              width: 15,
              height: 15,
              backgroundColor: getBackgroundColor(),
              borderRight: `1px solid ${getBorderColor()}`,
              borderTop: `1px solid ${getBorderColor()}`,
              borderLeft: 'none',
              borderBottom: 'none',
              zIndex: -1
            } : {}
          }}
        >
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
            {formatContent(message.content)}
          </Typography>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: 'block',
              mt: 0.5,
              textAlign: 'right',
              opacity: 0.7
            }}
          >
            {format(new Date(message.timestamp), 'HH:mm')}
          </Typography>
        </Paper>
      </Box>

      {isCurrentUser && (
        <Box sx={{ ml: 1.5, mt: 0.5 }}>
          {getSenderAvatar()}
        </Box>
      )}
    </Box>
  );
};

export default ChatMessage;