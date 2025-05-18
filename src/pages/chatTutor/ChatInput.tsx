// src/pages/chatTutor/ChatInput.tsx
import React, { useState, KeyboardEvent, useRef } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Paper,
  Tooltip,
  Button,
  Switch,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  TextField as MuiTextField,
  Chip,
  Menu,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  SendOutlined,
  DeleteOutlined,
  UploadOutlined,
  SaveOutlined,
  BookOutlined,
  QuestionCircleOutlined,
  BulbOutlined,
  CodeOutlined,
  SettingOutlined
} from '@ant-design/icons';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import CodeIcon from '@mui/icons-material/Code';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import HistoryIcon from '@mui/icons-material/History';
import SettingsIcon from '@mui/icons-material/Settings';

interface ChatInputProps {
  onSendMessage: (message: string, isCode?: boolean, codeLanguage?: string) => void;
  onClearChat: () => void;
  onSaveChat?: () => void;
  onUploadCode?: (file: File, language: string, requestAnalysis: boolean) => void;
  onToggleLearningMode?: () => void;
  onToggleDirectMode?: () => void;
  onToggleExplanationMode?: () => void;
  learningMode?: boolean;
  directMode?: boolean;
  explanationMode?: boolean;
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

const ModeChip = styled(Chip)(({ theme }) => ({
  height: '24px',
  fontSize: '0.75rem',
  '& .MuiChip-label': {
    padding: '0 8px',
  }
}));

const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  onClearChat,
  onSaveChat = () => {},
  onUploadCode = () => {},
  onToggleLearningMode = () => {},
  onToggleDirectMode = () => {},
  onToggleExplanationMode = () => {},
  learningMode = true,
  directMode = false,
  explanationMode = false,
  placeholder = 'Hỏi về lập trình C...',
  disabled = false
}) => {
  const [message, setMessage] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [isCodeMode, setIsCodeMode] = useState(false);
  const [codeLanguage, setCodeLanguage] = useState('c');
  
  // Dialog states
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [chatTitle, setChatTitle] = useState('');
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('c');
  const [requestAnalysis, setRequestAnalysis] = useState(true);
  
  // Menu state
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(menuAnchorEl);

  // File upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const codeInputRef = useRef<HTMLTextAreaElement>(null);

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message, isCodeMode, isCodeMode ? codeLanguage : undefined);
      setMessage('');
      setIsCodeMode(false);
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
      setSelectedFile(files[0]);
      setUploadDialogOpen(true);
    }
  };
  
  const handleUploadCode = () => {
    if (selectedFile) {
      onUploadCode(selectedFile, selectedLanguage, requestAnalysis);
      setUploadDialogOpen(false);
      setSelectedFile(null);
    }
  };
  
  const handleSaveChatClick = () => {
    setSaveDialogOpen(true);
    setChatTitle(`Cuộc trò chuyện - ${new Date().toLocaleDateString()}`);
  };
  
  const handleSaveChat = () => {
    onSaveChat();
    setSaveDialogOpen(false);
  };
  
  const handleLanguageChange = (event: SelectChangeEvent) => {
    setSelectedLanguage(event.target.value);
  };
  
  const handleCodeModeToggle = () => {
    setIsCodeMode(!isCodeMode);
    // Focus on code input when switching to code mode
    if (!isCodeMode) {
      setTimeout(() => {
        codeInputRef.current?.focus();
      }, 100);
    }
  };
  
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
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
            <AntIconButton onClick={handleFileSelect} size="small">
              <UploadOutlined />
            </AntIconButton>
          </Tooltip>

          <Tooltip title="Lưu cuộc trò chuyện">
            <AntIconButton onClick={handleSaveChatClick} size="small">
              <SaveOutlined />
            </AntIconButton>
          </Tooltip>

          <Tooltip title={isCodeMode ? "Chuyển sang chế độ văn bản" : "Chuyển sang chế độ code"}>
            <AntIconButton 
              onClick={handleCodeModeToggle} 
              size="small"
              color={isCodeMode ? "primary" : "default"}
            >
              <CodeOutlined />
            </AntIconButton>
          </Tooltip>

          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
            accept=".c,.cpp,.h,.java,.py,.js,.html,.css,.txt"
          />
        </LeftActions>

        <RightActions>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <ModeChip
              label="Học tập"
              color={learningMode ? "primary" : "default"}
              variant={learningMode ? "filled" : "outlined"}
              onClick={onToggleLearningMode}
              icon={<BookOutlined style={{ fontSize: '14px' }} />}
            />
            
            <ModeChip
              label="Giải thích"
              color={explanationMode ? "secondary" : "default"}
              variant={explanationMode ? "filled" : "outlined"}
              onClick={onToggleExplanationMode}
              icon={<BulbOutlined style={{ fontSize: '14px' }} />}
            />
            
            <ModeChip
              label="Trực tiếp"
              color={directMode ? "success" : "default"}
              variant={directMode ? "filled" : "outlined"}
              onClick={onToggleDirectMode}
            />
          </Box>
          
          <Tooltip title="Tùy chọn khác">
            <IconButton
              size="small"
              onClick={handleMenuOpen}
            >
              <MoreVertIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          
          <Menu
            anchorEl={menuAnchorEl}
            open={menuOpen}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => {
              handleMenuClose();
              // Handle history action
            }}>
              <ListItemIcon>
                <HistoryIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Lịch sử trò chuyện</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => {
              handleMenuClose();
              // Handle settings action
            }}>
              <ListItemIcon>
                <SettingsIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Cài đặt</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => {
              handleMenuClose();
              // Handle help action
            }}>
              <ListItemIcon>
                <QuestionCircleOutlined style={{ fontSize: '20px' }} />
              </ListItemIcon>
              <ListItemText>Trợ giúp</ListItemText>
            </MenuItem>
          </Menu>
        </RightActions>
      </TopActionBar>

      <InputWrapper>
        <TextField
          fullWidth
          multiline
          maxRows={isCodeMode ? 10 : 4}
          minRows={isCodeMode ? 5 : 1}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={!isCodeMode ? handleKeyPress : undefined}
          placeholder={isCodeMode ? "Nhập mã nguồn ở đây..." : placeholder}
          disabled={disabled}
          variant="outlined"
          size="small"
          inputRef={isCodeMode ? codeInputRef : undefined}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: isCodeMode ? '8px' : '24px',
              fontFamily: isCodeMode ? 'monospace' : 'inherit',
            }
          }}
          InputProps={isCodeMode ? {
            startAdornment: (
              <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
                <FormControl variant="standard" size="small" sx={{ minWidth: 80 }}>
                  <Select
                    value={codeLanguage}
                    onChange={(e) => setCodeLanguage(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MenuItem value="c">C</MenuItem>
                    <MenuItem value="cpp">C++</MenuItem>
                    <MenuItem value="java">Java</MenuItem>
                    <MenuItem value="python">Python</MenuItem>
                    <MenuItem value="javascript">JavaScript</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            )
          } : undefined}
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
      
      {/* Save Chat Dialog */}
      <Dialog open={saveDialogOpen} onClose={() => setSaveDialogOpen(false)}>
        <DialogTitle>Lưu cuộc trò chuyện</DialogTitle>
        <DialogContent>
          <MuiTextField
            autoFocus
            margin="dense"
            label="Tiêu đề cuộc trò chuyện"
            type="text"
            fullWidth
            variant="outlined"
            value={chatTitle}
            onChange={(e) => setChatTitle(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSaveDialogOpen(false)}>Hủy</Button>
          <Button onClick={handleSaveChat} variant="contained">Lưu</Button>
        </DialogActions>
      </Dialog>
      
      {/* Upload Code Dialog */}
      <Dialog open={uploadDialogOpen} onClose={() => setUploadDialogOpen(false)}>
        <DialogTitle>Tải lên mã nguồn</DialogTitle>
        <DialogContent>
          <Typography variant="body2" gutterBottom>
            File: {selectedFile?.name}
          </Typography>
          
          <FormControl fullWidth margin="normal">
            <InputLabel id="code-language-label">Ngôn ngữ</InputLabel>
            <Select
              labelId="code-language-label"
              value={selectedLanguage}
              label="Ngôn ngữ"
              onChange={handleLanguageChange}
            >
              <MenuItem value="c">C</MenuItem>
              <MenuItem value="cpp">C++</MenuItem>
              <MenuItem value="java">Java</MenuItem>
              <MenuItem value="python">Python</MenuItem>
              <MenuItem value="javascript">JavaScript</MenuItem>
              <MenuItem value="html">HTML</MenuItem>
              <MenuItem value="css">CSS</MenuItem>
              <MenuItem value="other">Khác</MenuItem>
            </Select>
          </FormControl>
          
          <Box sx={{ mt: 2 }}>
            <FormControl>
              <Switch
                checked={requestAnalysis}
                onChange={(e) => setRequestAnalysis(e.target.checked)}
              />
              <Typography variant="body2">
                Yêu cầu AI phân tích mã nguồn
              </Typography>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDialogOpen(false)}>Hủy</Button>
          <Button onClick={handleUploadCode} variant="contained">Tải lên</Button>
        </DialogActions>
      </Dialog>
    </ChatInputContainer>
  );
};

export default ChatInput;