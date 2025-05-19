// src/pages/chatTutor/Index.tsx
import React, { useRef, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  IconButton,
  Tooltip,
  Alert,
  Snackbar,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { styled } from '@mui/material/styles';
import HistoryIcon from '@mui/icons-material/History';
import SettingsIcon from '@mui/icons-material/Settings';
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import { AppDispatch } from '@/redux/store';

// Import components
import ChatInput from './ChatInput';
import WelcomeMessage from './WelcomeMessage';
import ChatMessage from './ChatMessage';
import ChatHeader from './ChatHeader';

// Import from slice
import {
  addMessage,
  sendMessage,
  clearChat,
  fetchSuggestions,
  saveChat,
  loadChatHistory,
  loadChatSession,
  uploadCode,
  toggleLearningMode,
  toggleDirectMode,
  toggleExplanationMode,
  setActiveSession,
  provideFeedback,
  clearError,
  selectMessages,
  selectIsTyping,
  selectSuggestions,
  selectCurrentTopic,
  selectStatus,
  selectError,
  selectLearningContext,
  selectChatHistory,
  selectActiveSession,
  selectShowExplanationMode
} from '@/redux/slices/chatTutorSlice';

const drawerWidth = 280;

const ChatWrapper = styled(Paper)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  maxHeight: '100vh',
  width: '100%',
  overflow: 'hidden',
  borderRadius: 0,
  position: 'relative',
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
}));

const ChatContent = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  height: 'calc(100vh - 48px)',
  overflow: 'hidden',
}));

const MessagesContainer = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  overflowY: 'auto',
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
}));

const TypingIndicator = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginLeft: theme.spacing(5),
  marginBottom: theme.spacing(2),
}));

// Sử dụng trực tiếp IconButton với sx prop

const ChatTutor: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const messages = useSelector(selectMessages);
  const isTyping = useSelector(selectIsTyping);
  const suggestions = useSelector(selectSuggestions);
  const currentTopic = useSelector(selectCurrentTopic);
  const status = useSelector(selectStatus);
  const error = useSelector(selectError);
  const learningContext = useSelector(selectLearningContext);
  const chatHistory = useSelector(selectChatHistory);
  const activeSession = useSelector(selectActiveSession);
  const showExplanationMode = useSelector(selectShowExplanationMode);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Cuộn xuống dưới khi có tin nhắn mới
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Lấy gợi ý và lịch sử chat khi component được tải
  useEffect(() => {
    dispatch(fetchSuggestions());
    dispatch(loadChatHistory());
  }, [dispatch]);

  const handleSendMessage = (message: string, isCode = false, codeLanguage = 'c') => {
    // Thêm tin nhắn của người dùng vào store
    dispatch(addMessage({
      content: message,
      sender: 'user',
      isCode,
      codeLanguage
    }));

    // Gửi tin nhắn đến API và nhận phản hồi
    dispatch(sendMessage({
      message,
      isCode,
      codeLanguage,
      requestExplanation: showExplanationMode
    }));
  };

  const handleClearChat = () => {
    dispatch(clearChat());
  };

  const handleToggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleToggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleSaveChat = () => {
    setSaveDialogOpen(true);
  };

  const handleConfirmSave = (title?: string) => {
    dispatch(saveChat(title))
      .then(() => {
        setSaveSuccess(true);
        setSaveDialogOpen(false);
      });
  };

  const handleLoadSession = (sessionId: string) => {
    dispatch(setActiveSession(sessionId));
    dispatch(loadChatSession(sessionId));
    if (isMobile) {
      setDrawerOpen(false);
    }
  };

  const handleUploadCode = (file: File, language = 'c', requestAnalysis = true) => {
    dispatch(uploadCode({ file, language, requestAnalysis }));
  };

  const handleToggleLearningMode = () => {
    dispatch(toggleLearningMode());
  };

  const handleToggleDirectMode = () => {
    dispatch(toggleDirectMode());
  };

  const handleToggleExplanationMode = () => {
    dispatch(toggleExplanationMode());
  };

  const handleMessageFeedback = (messageId: string, helpful: boolean, reason?: string) => {
    dispatch(provideFeedback({ messageId, helpful, reason }));
  };

  const handleCloseError = () => {
    dispatch(clearError());
  };

  return (
    <Box sx={{
      display: 'flex',
      width: '100%',
      maxWidth: '100vw',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Drawer for chat history */}
      <Drawer
        variant={isMobile ? "temporary" : "persistent"}
        open={drawerOpen}
        onClose={handleToggleDrawer}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          position: 'absolute',
          zIndex: theme => theme.zIndex.drawer,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            position: 'absolute',
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', p: 2, justifyContent: 'space-between' }}>
          <Typography variant="h6" component="div">
            Lịch sử trò chuyện
          </Typography>
          <IconButton onClick={handleToggleDrawer}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />
        <List>
          {chatHistory.length > 0 ? (
            chatHistory.map((session) => (
              <ListItem
                button
                key={session.id}
                selected={activeSession === session.id}
                onClick={() => handleLoadSession(session.id)}
              >
                <ListItemIcon>
                  <HistoryIcon />
                </ListItemIcon>
                <ListItemText
                  primary={session.title}
                  secondary={`${new Date(session.timestamp).toLocaleDateString()} - ${session.messageCount} tin nhắn`}
                />
              </ListItem>
            ))
          ) : (
            <ListItem>
              <ListItemText primary="Không có lịch sử trò chuyện" />
            </ListItem>
          )}
        </List>
      </Drawer>

      {/* Main chat area */}
      <ChatWrapper
        elevation={0}
        sx={{
          flexGrow: 1,
          marginLeft: { xs: 0, md: drawerOpen ? `${drawerWidth}px` : 0 },
          width: { xs: '100%', md: drawerOpen ? `calc(100% - ${drawerWidth}px)` : '100%' },
          transition: theme => theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <IconButton
          color="inherit"
          onClick={handleToggleDrawer}
          sx={{
            display: drawerOpen && !isMobile ? 'none' : 'flex',
            position: 'absolute',
            top: theme.spacing(1),
            left: theme.spacing(1),
            zIndex: 1200,
          }}
        >
          <MenuIcon />
        </IconButton>

        <ChatHeader
          title={currentTopic}
          isDarkMode={isDarkMode}
          onToggleTheme={handleToggleTheme}
          onOpenSettings={() => {}}
        />

        <ChatContent>
          {/* Error message */}
          {error && (
            <Alert
              severity="error"
              sx={{ m: 2 }}
              onClose={handleCloseError}
            >
              {error}
            </Alert>
          )}

          {messages.length === 0 ? (
            <WelcomeMessage
              title="Chào mừng đến với Trợ Giảng AI"
              subtitle="Trợ lý học tập cá nhân của bạn"
              suggestions={suggestions || []}
              onSelectSuggestion={handleSendMessage}
            />
          ) : (
            <MessagesContainer>
              {Array.isArray(messages) ? (
                messages.map((message) => (
                  <ChatMessage
                    key={message.id}
                    message={message}
                    onProvideFeedback={handleMessageFeedback}
                  />
                ))
              ) : (
                <Typography color="error">
                  Error: Expected messages to be an array
                </Typography>
              )}

              {isTyping && (
                <TypingIndicator>
                  <CircularProgress size={16} thickness={5} sx={{ mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    Đang trả lời...
                  </Typography>
                </TypingIndicator>
              )}

              <div ref={messagesEndRef} />
            </MessagesContainer>
          )}

          <ChatInput
            onSendMessage={handleSendMessage}
            onClearChat={handleClearChat}
            onSaveChat={handleSaveChat}
            onUploadCode={handleUploadCode}
            onToggleLearningMode={handleToggleLearningMode}
            onToggleDirectMode={handleToggleDirectMode}
            onToggleExplanationMode={handleToggleExplanationMode}
            learningMode={learningContext.learningMode}
            directMode={learningContext.directMode}
            explanationMode={showExplanationMode}
            disabled={isTyping || status === 'loading'}
            placeholder={`Hỏi về ${currentTopic}...`}
          />
        </ChatContent>

        {/* Success message for saving chat */}
        <Snackbar
          open={saveSuccess}
          autoHideDuration={3000}
          onClose={() => setSaveSuccess(false)}
          message="Cuộc trò chuyện đã được lưu thành công"
          action={
            <IconButton size="small" color="inherit" onClick={() => setSaveSuccess(false)}>
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        />
      </ChatWrapper>
    </Box>
  );
};

export default ChatTutor;