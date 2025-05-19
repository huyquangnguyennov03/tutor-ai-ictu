import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  Button,
  Fade,
  Tooltip,
  Avatar,
  useMediaQuery,
  useTheme,
  CircularProgress,
  Drawer
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CodeIcon from '@mui/icons-material/Code';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ErrorIcon from '@mui/icons-material/Error'; // Added Error icon for mobile profile view
import { Message, User, Conversation } from './types';
import ChatMessage from './ChatMessage';
import StudentProfile from './StudentProfile';
import { format, isToday, isYesterday } from 'date-fns';
import { vi } from 'date-fns/locale';
import { mockStudentProgress } from '../../mockData/mockDataChat'; // Import mockStudentProgress for the profile

interface ChatBoxProps {
  className: string;
  selectedUser: User | null;
  conversation: Conversation | null;
  messages: Message[];
  onSendMessage: (content: string) => void;
  onTyping?: (isTyping: boolean) => void;
  onToggleAITutor: () => void;
  isAITutorEnabled: boolean;
  isTyping?: boolean;
  currentUser: User;
  onOpenUserList?: () => void;
  onBackToList?: () => void;
}

const ChatBox: React.FC<ChatBoxProps> = ({
                                           className,
                                           selectedUser,
                                           conversation,
                                           messages,
                                           onSendMessage,
                                           onTyping,
                                           onToggleAITutor,
                                           isAITutorEnabled,
                                           isTyping = false,
                                           currentUser,
                                           onOpenUserList,
                                           onBackToList
                                         }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [newMessage, setNewMessage] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // State for profile drawer on mobile
  const [profileDrawerOpen, setProfileDrawerOpen] = useState<boolean>(false);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setIsSending(true);

      // Simulate network delay
      setTimeout(() => {
        onSendMessage(newMessage);
        setNewMessage('');
        setIsSending(false);
      }, 500);
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

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewMessage(value);

    // Handle typing indicator
    if (onTyping) {
      // Clear any existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Send typing indicator if there's content
      if (value.trim()) {
        onTyping(true);

        // Set timeout to stop typing indicator after 3 seconds of inactivity
        typingTimeoutRef.current = setTimeout(() => {
          onTyping(false);
        }, 3000);
      } else {
        onTyping(false);
      }
    }
  };

  // Handle opening the profile drawer on mobile
  const handleOpenProfileDrawer = () => {
    setProfileDrawerOpen(true);
  };

  // Scroll to bottom on new message
// Thay thế useEffect cũ bằng cách này
  useEffect(() => {
    if (messagesEndRef.current) {
      const messagesContainer = messagesEndRef.current.parentElement;
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    }
  }, [messages, isTyping]);

  // Group messages by date
  const groupMessagesByDate = () => {
    const groups: { [key: string]: Message[] } = {};

    messages.forEach((message) => {
      const date = format(new Date(message.timestamp), 'yyyy-MM-dd');
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });

    return groups;
  };

  const renderDateDivider = (date: string) => {
    const messageDate = new Date(date);

    let displayDate;
    if (isToday(messageDate)) {
      displayDate = 'Hôm nay';
    } else if (isYesterday(messageDate)) {
      displayDate = 'Hôm qua';
    } else {
      displayDate = format(messageDate, 'dd MMMM, yyyy', { locale: vi });
    }

    return (
      <Box
        key={date}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          my: 2,
        }}
      >
        <Typography
          variant="caption"
          sx={{
            px: 2,
            py: 0.5,
            borderRadius: 1,
            backgroundColor: 'grey.100',
            color: 'text.secondary',
          }}
        >
          {displayDate}
        </Typography>
      </Box>
    );
  };

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
      {selectedUser ? (
        <>
          {/* Header */}
          <Box sx={{
            p: 1,
            bgcolor: 'primary.main',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {isMobile && (
                <IconButton
                  color="inherit"
                  edge="start"
                  onClick={onBackToList}
                  sx={{ mr: 1 }}
                >
                  <ArrowBackIcon />
                </IconButton>
              )}

              <Avatar
                src={selectedUser.avatar}
                alt={selectedUser.name}
                sx={{ mr: 1.5, width: 40, height: 40 }}
              >
                {selectedUser.name.charAt(0)}
              </Avatar>

              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {selectedUser.name}
                </Typography>
                <Typography variant="caption">
                  {selectedUser.status === 'online' ? (
                    <Box component="span" sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box
                        component="span"
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          bgcolor: '#4CAF50',
                          display: 'inline-block',
                          mr: 0.5,
                        }}
                      />
                      Online
                    </Box>
                  ) : (
                    selectedUser.status === 'away' ? 'Đang chờ' : 'Offline'
                  )}
                </Typography>
              </Box>
            </Box>

            <Box>
              {/* Profile button for mobile */}
              {isMobile && selectedUser && (
                <Tooltip title="Xem thông tin">
                  <IconButton
                    color="inherit"
                    onClick={handleOpenProfileDrawer}
                    sx={{ mr: 1 }}
                  >
                    <ErrorIcon />
                  </IconButton>
                </Tooltip>
              )}

              <Tooltip title={isAITutorEnabled ? "Tắt AI Tutor" : "Bật AI Tutor"}>
                <Button
                  variant={isAITutorEnabled ? "contained" : "outlined"}
                  color="secondary"
                  size="small"
                  startIcon={<SmartToyIcon />}
                  onClick={onToggleAITutor}
                  sx={{
                    mr: { xs: 0, sm: 1 },
                    bgcolor: isAITutorEnabled ? 'secondary.main' : 'transparent',
                    borderColor: 'rgba(255,255,255,0.5)',
                    color: 'white',
                    '&:hover': {
                      bgcolor: isAITutorEnabled ? 'secondary.dark' : 'rgba(255,255,255,0.1)',
                      borderColor: 'white'
                    },
                    display: { xs: 'none', sm: 'inline-flex' }
                  }}
                >
                  {isAITutorEnabled ? "AI Tutor đang bật" : "Bật AI Tutor"}
                </Button>
              </Tooltip>

              {!isMobile && (
                <Tooltip title="Gửi nhắc nhở">
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
              )}

              {isMobile && (
                <Tooltip title={isAITutorEnabled ? "Tắt AI Tutor" : "Bật AI Tutor"}>
                  <IconButton
                    color={isAITutorEnabled ? "secondary" : "inherit"}
                    onClick={onToggleAITutor}
                    size="small"
                  >
                    <SmartToyIcon />
                  </IconButton>
                </Tooltip>
              )}
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
            {messages.length > 0 ? (
              Object.entries(groupMessagesByDate()).map(([date, dateMessages]) => (
                <React.Fragment key={date}>
                  {renderDateDivider(date)}
                  {dateMessages.map((message) => (
                    <ChatMessage
                      key={message.id}
                      message={message}
                      isCurrentUser={message.sender === currentUser.id}
                      senderName={
                        message.senderType === 'ai'
                          ? 'AI Tutor'
                          : message.sender === currentUser.id
                            ? currentUser.name
                            : selectedUser.name
                      }
                      senderAvatar={
                        message.senderType === 'ai'
                          ? undefined
                          : message.sender === currentUser.id
                            ? currentUser.avatar
                            : selectedUser.avatar
                      }
                    />
                  ))}
                </React.Fragment>
              ))
            ) : (
              <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                p: 3
              }}>
                <Typography variant="body1" color="text.secondary" align="center" gutterBottom>
                  Chưa có tin nhắn nào
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center">
                  Hãy bắt đầu cuộc trò chuyện với {selectedUser.name}
                </Typography>
              </Box>
            )}

            {/* Typing indicator */}
            {isTyping && (
              <Fade in={isTyping}>
                <Box sx={{ display: 'flex', alignItems: 'center', p: 1, ml: 1 }}>
                  <Avatar
                    src={selectedUser.avatar}
                    alt={selectedUser.name}
                    sx={{ width: 24, height: 24, mr: 1 }}
                  >
                    {selectedUser.name.charAt(0)}
                  </Avatar>
                  <Typography variant="caption" color="text.secondary">
                    đang nhập...
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
                onChange={handleMessageChange}
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
                    disabled={!newMessage.trim() || isSending}
                    sx={{
                      bgcolor: newMessage.trim() && !isSending ? 'primary.main' : 'action.disabledBackground',
                      color: 'white',
                      '&:hover': { bgcolor: 'primary.dark' },
                      '&.Mui-disabled': { bgcolor: 'action.disabledBackground', color: 'text.disabled' },
                      ml: 1
                    }}
                  >
                    {isSending ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      <SendIcon />
                    )}
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Box>

          {/* Mobile Profile Drawer */}
          <Drawer
            anchor="right"
            open={profileDrawerOpen}
            onClose={() => setProfileDrawerOpen(false)}
            sx={{
              display: { xs: 'block', md: 'none' },
              '& .MuiDrawer-paper': { width: '80%', maxWidth: 350 },
            }}
          >
            <Box sx={{ height: '100%', overflow: 'auto' }}>
              {selectedUser && (
                <StudentProfile
                  user={selectedUser}
                  progress={mockStudentProgress}
                  currentUserRole={currentUser.role}
                />
              )}
            </Box>
          </Drawer>
        </>
      ) : (
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          p: 3
        }}>
          <Typography variant="h6" color="text.secondary" align="center" gutterBottom>
            Hệ thống chat
          </Typography>
          <Typography variant="body1" color="text.secondary" align="center">
            Đang tải cuộc trò chuyện...
          </Typography>

          {isMobile && (
            <Button
              variant="contained"
              color="primary"
              onClick={onOpenUserList}
              sx={{ mt: 2 }}
            >
              Xem danh sách {currentUser.role === 'app-admin' ? 'sinh viên' : 'giáo viên'}
            </Button>
          )}
        </Box>
      )}
    </Paper>
  );
};

export default ChatBox;