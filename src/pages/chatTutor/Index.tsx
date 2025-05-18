// src/pages/chatTutor/Index.tsx
import React, { useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Paper, Typography, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';

// Import components
import ChatInput from './ChatInput';
import WelcomeMessage from './WelcomeMessage';
import ChatMessage from './ChatMessage';

// Import from slice
import {
  addMessage,
  sendMessage,
  clearChat,
  fetchSuggestions,
  selectMessages,
  selectIsTyping,
  selectSuggestions,
  selectCurrentTopic,
  selectStatus
} from '@/redux/slices/chatTutorSlice';

const ChatWrapper = styled(Paper)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  maxHeight: '100vh',
  overflow: 'hidden',
  borderRadius: theme.shape.borderRadius,
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

const ChatTutor: React.FC = () => {
  const dispatch = useDispatch();
  const messages = useSelector(selectMessages) || [];
  const isTyping = useSelector(selectIsTyping);
  const suggestions = useSelector(selectSuggestions);
  const currentTopic = useSelector(selectCurrentTopic);
  const status = useSelector(selectStatus);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Cuộn xuống dưới khi có tin nhắn mới
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Lấy gợi ý khi component được tải
  useEffect(() => {
    dispatch(fetchSuggestions(currentTopic) as any);
  }, [dispatch, currentTopic]);

  const handleSendMessage = (message: string) => {
    // Thêm tin nhắn của người dùng vào store
    dispatch(addMessage({ content: message, sender: 'user' }));

    // Gửi tin nhắn đến API và nhận phản hồi
    dispatch(sendMessage(message) as any);
  };

  const handleClearChat = () => {
    dispatch(clearChat());
  };

  return (
    <ChatWrapper elevation={0}>
      <ChatContent>
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
                <ChatMessage key={message.id} message={message} />
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
          disabled={isTyping || status === 'loading'}
          placeholder={`Hỏi về ${currentTopic}...`}
        />
      </ChatContent>
    </ChatWrapper>
  );
};

export default ChatTutor;