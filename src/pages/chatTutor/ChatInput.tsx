// src/pages/chatTutor/ChatInput.tsx
import React, { useState, KeyboardEvent } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Paper,
  Tooltip,
  Button,
  Switch,
  Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  SendOutlined,
  DeleteOutlined,
  UploadOutlined,
  SaveOutlined,
  BookOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onClearChat: () => void;
  onSaveChat?: () => void;
  placeholder?: string;
  disabled?: boolean;
}

const ChatInputContainer = styled(Paper)(({ theme }) => ({
  position: 'sticky',
  bottom: 0,
  padding: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
}));

const InputWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
}));

const ActionButtons = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginLeft: theme.spacing(1),
}));

const TopActionBar = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(1),
  padding: theme.spacing(0.5, 1),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.default,
}));

const LeftActions = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

const RightActions = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
}));

const AntIconButton = styled(IconButton)({
  '& .anticon': {
    fontSize: '1.25rem',
  },
});

const ChatInput: React.FC<ChatInputProps> = ({
                                               onSendMessage,
                                               onClearChat,
                                               onSaveChat = () => {},
                                               placeholder = 'Hỏi về lập trình C...',
                                               disabled = false
                                             }) => {
  const [message, setMessage] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [learningMode, setLearningMode] = useState(true);
  const [directMode, setDirectMode] = useState(false);

  // File upload state
  const [fileSelected, setFileSelected] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
      setFileSelected(false);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearClick = () => {
    if (showClearConfirm) {
      onClearChat();
      setShowClearConfirm(false);
    } else {
      setShowClearConfirm(true);
    }
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setFileSelected(true);
      // Here you would handle the file, maybe update the message with file info
      setMessage(`${message} [File attached: ${files[0].name}]`);
    }
  };

  const handleLearningModeToggle = () => {
    setLearningMode(!learningMode);
  };

  return (
    <ChatInputContainer elevation={0}>
      {showClearConfirm && (
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={handleClearClick}
          >
            Xác nhận xóa cuộc trò chuyện
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => setShowClearConfirm(false)}
          >
            Hủy
          </Button>
        </Box>
      )}

      <TopActionBar>
        <LeftActions>
          <Tooltip title="Xóa cuộc trò chuyện">
            <AntIconButton onClick={() => setShowClearConfirm(true)} size="small">
              <DeleteOutlined />
            </AntIconButton>
          </Tooltip>

          <Tooltip title="Tải lên mã">
            <AntIconButton onClick={handleFileSelect} size="small" color={fileSelected ? "primary" : "default"}>
              <UploadOutlined />
            </AntIconButton>
          </Tooltip>

          <Tooltip title="Lưu cuộc trò chuyện">
            <AntIconButton onClick={onSaveChat} size="small">
              <SaveOutlined />
            </AntIconButton>
          </Tooltip>

          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
        </LeftActions>

        <RightActions>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ mr: 1 }}>
              Trực Tiếp
            </Typography>
            <Switch
              size="small"
              checked={directMode}
              onChange={(e) => setDirectMode(e.target.checked)}
            />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ mr: 1 }}>
              Đặt Câu Hỏi
            </Typography>
            <Tooltip title="Trợ giúp đặt câu hỏi">
              <AntIconButton size="small">
                <QuestionCircleOutlined />
              </AntIconButton>
            </Tooltip>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ mr: 1 }}>
              Chế Độ Học
            </Typography>
            <Tooltip title={learningMode ? "Đang bật chế độ học" : "Chế độ học đang tắt"}>
              <AntIconButton
                size="small"
                color={learningMode ? "primary" : "default"}
                onClick={handleLearningModeToggle}
              >
                <BookOutlined />
              </AntIconButton>
            </Tooltip>
          </Box>
        </RightActions>
      </TopActionBar>

      <InputWrapper>
        <TextField
          fullWidth
          multiline
          maxRows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder={placeholder}
          disabled={disabled}
          variant="outlined"
          size="small"
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '24px',
            }
          }}
        />

        <ActionButtons>
          <Tooltip title="Gửi tin nhắn">
            <span>
              <AntIconButton
                onClick={handleSendMessage}
                disabled={!message.trim() || disabled}
                color="primary"
              >
                <SendOutlined />
              </AntIconButton>
            </span>
          </Tooltip>
        </ActionButtons>
      </InputWrapper>
    </ChatInputContainer>
  );
};

export default ChatInput;