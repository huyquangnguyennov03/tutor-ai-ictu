import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  Button,
  Fade,
  Tooltip
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CodeIcon from '@mui/icons-material/Code';
import { Message, Student } from './types';
import ChatMessage from './ChatMessage';

interface ChatBoxProps {
  className: string;
  selectedStudent: Student | null;
  messages: Message[];
  onSendMessage: (content: string) => void;
  onToggleAITutor: () => void;
  isAITutorEnabled: boolean;
}

const ChatBox: React.FC<ChatBoxProps> = ({
                                           className,
                                           selectedStudent,
                                           messages,
                                           onSendMessage,
                                           onToggleAITutor,
                                           isAITutorEnabled
                                         }) => {
  const [newMessage, setNewMessage] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleInsertCodeSnippet = () => {
    setNewMessage(prev => prev + '\n```\n// Insert code here\n```');
  };

  // Simulate typing indicator
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.senderType === 'student') {
      setIsTyping(true);
      const timer = setTimeout(() => {
        setIsTyping(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [messages]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <Paper sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      borderRadius: 2,
      boxShadow: 0,
      border: '1px solid rgba(0,0,0,0.08)'
    }}>
      {/* Header */}
      <Box sx={{
        p: 2,
        bgcolor: 'primary.main',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {className}
        </Typography>
        <Box>
          <Tooltip title={isAITutorEnabled ? "Tắt AI Tutor" : "Bật AI Tutor"}>
            <Button
              variant={isAITutorEnabled ? "contained" : "outlined"}
              color="secondary"
              size="small"
              startIcon={<SmartToyIcon />}
              onClick={onToggleAITutor}
              sx={{
                mr: 1,
                bgcolor: isAITutorEnabled ? 'secondary.main' : 'transparent',
                borderColor: 'rgba(255,255,255,0.5)',
                color: 'white',
                '&:hover': {
                  bgcolor: isAITutorEnabled ? 'secondary.dark' : 'rgba(255,255,255,0.1)',
                  borderColor: 'white'
                }
              }}
            >
              {isAITutorEnabled ? "AI Tutor đang bật" : "Bật AI Tutor"}
            </Button>
          </Tooltip>
          <Tooltip title="Gửi nhắc nhở cho sinh viên">
            <Button
              variant="outlined"
              size="small"
              startIcon={<NotificationsIcon />}
              sx={{
                color: 'white',
                borderColor: 'rgba(255,255,255,0.5)',
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              Nhắc nhở
            </Button>
          </Tooltip>
        </Box>
      </Box>

      {/* Messages area */}
      <Box sx={{
        flexGrow: 1,
        overflow: 'auto',
        p: 2,
        bgcolor: '#f8f9fa',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            isCurrentUser={message.senderType === 'teacher'}
          />
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <Fade in={isTyping}>
            <Box sx={{ display: 'flex', alignItems: 'center', p: 1, ml: 1 }}>
              <Typography variant="caption" color="text.secondary">
                {selectedStudent?.name} đang nhập...
              </Typography>
            </Box>
          </Fade>
        )}

        <div ref={messagesEndRef} />
      </Box>

      {/* Input area */}
      <Box sx={{ p: 2, bgcolor: 'background.paper', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
          <TextField
            fullWidth
            placeholder="Nhập tin nhắn..."
            variant="outlined"
            size="small"
            multiline
            maxRows={4}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                '&.Mui-focused fieldset': {
                  borderColor: 'primary.main',
                },
              }
            }}
          />

          <Box sx={{ display: 'flex', ml: 1 }}>
            <Tooltip title="Đính kèm tập tin">
              <IconButton onClick={handleFileUpload} sx={{ color: 'text.secondary' }}>
                <AttachFileIcon />
              </IconButton>
            </Tooltip>
            <input
              type="file"
              hidden
              ref={fileInputRef}
            />

            <Tooltip title="Chèn mã code">
              <IconButton onClick={handleInsertCodeSnippet} sx={{ color: 'text.secondary' }}>
                <CodeIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Gửi tin nhắn">
              <IconButton
                color="primary"
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                sx={{
                  bgcolor: newMessage.trim() ? 'primary.main' : 'action.disabledBackground',
                  color: 'white',
                  '&:hover': { bgcolor: 'primary.dark' },
                  '&.Mui-disabled': { bgcolor: 'action.disabledBackground', color: 'text.disabled' },
                  ml: 1
                }}
              >
                <SendIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default ChatBox;