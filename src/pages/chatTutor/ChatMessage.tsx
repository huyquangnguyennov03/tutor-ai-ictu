// src/pages/chatTutor/ChatMessage.tsx
import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Avatar, 
  Tooltip, 
  IconButton, 
  Collapse,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CodeIcon from '@mui/icons-material/Code';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { Message } from '@/redux/slices/chatTutorSlice';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface ChatMessageProps {
  message: Message;
  onProvideFeedback?: (messageId: string, helpful: boolean, reason?: string) => void;
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

const MessageActions = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  marginTop: theme.spacing(1),
  gap: theme.spacing(0.5),
}));

const CodeBlock = styled(Box)(({ theme }) => ({
  position: 'relative',
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
}));

const CodeHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(0.5, 1),
  backgroundColor: theme.palette.grey[100],
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const FeedbackChip = styled(Box)(({ theme, helpful }: { theme: any, helpful: boolean }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  padding: theme.spacing(0.5, 1),
  borderRadius: '16px',
  fontSize: '0.75rem',
  backgroundColor: helpful 
    ? 'rgba(46, 125, 50, 0.1)' 
    : 'rgba(211, 47, 47, 0.1)',
  color: helpful 
    ? theme.palette.success.main 
    : theme.palette.error.main,
  marginTop: theme.spacing(0.5),
}));

// Helper function to extract code blocks from markdown-style content
const extractCodeBlocks = (content: string) => {
  const codeBlockRegex = /```(\w*)\n([\s\S]*?)```/g;
  const matches = [...content.matchAll(codeBlockRegex)];
  
  if (matches.length === 0) return { text: content, codeBlocks: [] };
  
  let lastIndex = 0;
  let text = '';
  const codeBlocks: { language: string; code: string; index: number }[] = [];
  
  matches.forEach((match, idx) => {
    const [fullMatch, language, code] = match;
    const matchIndex = match.index as number;
    
    // Add text before code block
    text += content.substring(lastIndex, matchIndex);
    
    // Add placeholder for code block
    text += `[CODE_BLOCK_${idx}]`;
    
    // Save code block
    codeBlocks.push({
      language: language || 'text',
      code: code.trim(),
      index: idx
    });
    
    lastIndex = matchIndex + fullMatch.length;
  });
  
  // Add remaining text
  text += content.substring(lastIndex);
  
  return { text, codeBlocks };
};

// Helper function to format text with markdown-like syntax
const formatText = (text: string) => {
  return text
    .replace(/\n/g, '<br/>')
    // Bold text
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    // Italic text
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Headers
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^# (.*$)/gm, '<h1>$1</h1>');
};

const ChatMessage: React.FC<ChatMessageProps> = ({ message, onProvideFeedback }) => {
  const { id, content, sender, timestamp, isCode, codeLanguage, feedback } = message;
  const [expanded, setExpanded] = useState(true);
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [feedbackReason, setFeedbackReason] = useState('');
  const [feedbackType, setFeedbackType] = useState('helpful');
  
  // Format timestamp
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Handle copy to clipboard
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };
  
  // Handle feedback submission
  const handleSubmitFeedback = () => {
    if (onProvideFeedback) {
      onProvideFeedback(id, feedbackType === 'helpful', feedbackReason);
    }
    setFeedbackDialogOpen(false);
  };

  // If the message is from the user
  if (sender === 'user') {
    // If it's a code message
    if (isCode) {
      const language = codeLanguage || 'text';
      const codeContent = content.replace(/```\w*\n|\n```/g, '');
      
      return (
        <MessageContainer>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', maxWidth: '80%' }}>
            <UserMessagePaper elevation={0}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <CodeIcon fontSize="small" sx={{ mr: 1 }} />
                <Typography variant="body2" fontWeight="medium">
                  {language.toUpperCase()}
                </Typography>
              </Box>
              
              <CodeBlock>
                <SyntaxHighlighter
                  language={language}
                  style={materialLight}
                  customStyle={{ margin: 0 }}
                >
                  {codeContent}
                </SyntaxHighlighter>
                
                <MessageActions>
                  <Tooltip title="Sao chép mã">
                    <IconButton size="small" onClick={() => handleCopy(codeContent)}>
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </MessageActions>
              </CodeBlock>
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
    
    // Regular user message
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

  // AI message with code blocks
  if (content.includes('```')) {
    const { text, codeBlocks } = extractCodeBlocks(content);
    
    return (
      <MessageContainer>
        <Tooltip title="Trợ lý AI" placement="right">
          <MessageAvatar>
            <SmartToyIcon />
          </MessageAvatar>
        </Tooltip>
        <Box sx={{ display: 'flex', flexDirection: 'column', maxWidth: '80%' }}>
          <AIMessagePaper elevation={0}>
            {/* Header with expand/collapse button */}
            {codeBlocks.length > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
                <Button
                  size="small"
                  startIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  onClick={() => setExpanded(!expanded)}
                >
                  {expanded ? 'Thu gọn' : 'Mở rộng'}
                </Button>
              </Box>
            )}
            
            {/* Message text */}
            <Collapse in={expanded}>
              {text.split('[CODE_BLOCK_').map((part, index) => {
                if (index === 0) {
                  return (
                    <Typography
                      key={`text-${index}`}
                      variant="body1"
                      sx={{ 
                        '& code': { 
                          backgroundColor: (theme) => theme.palette.action.hover,
                          padding: '2px 4px',
                          borderRadius: '4px',
                          fontFamily: 'monospace'
                        }
                      }}
                      dangerouslySetInnerHTML={{ __html: formatText(part) }}
                    />
                  );
                }
                
                const [blockIndexStr, remainingText] = part.split(']');
                const blockIndex = parseInt(blockIndexStr);
                const codeBlock = codeBlocks.find(block => block.index === blockIndex);
                
                return (
                  <React.Fragment key={`code-${blockIndex}`}>
                    {codeBlock && (
                      <CodeBlock>
                        <CodeHeader>
                          <Typography variant="caption" fontWeight="medium">
                            {codeBlock.language.toUpperCase() || 'CODE'}
                          </Typography>
                          <IconButton 
                            size="small" 
                            onClick={() => handleCopy(codeBlock.code)}
                          >
                            <ContentCopyIcon fontSize="small" />
                          </IconButton>
                        </CodeHeader>
                        <SyntaxHighlighter
                          language={codeBlock.language || 'text'}
                          style={materialLight}
                          customStyle={{ margin: 0 }}
                        >
                          {codeBlock.code}
                        </SyntaxHighlighter>
                      </CodeBlock>
                    )}
                    {remainingText && (
                      <Typography
                        variant="body1"
                        sx={{ 
                          marginTop: 1,
                          '& code': { 
                            backgroundColor: (theme) => theme.palette.action.hover,
                            padding: '2px 4px',
                            borderRadius: '4px',
                            fontFamily: 'monospace'
                          }
                        }}
                        dangerouslySetInnerHTML={{ __html: formatText(remainingText) }}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </Collapse>
            
            {/* Feedback section */}
            {feedback ? (
              <Box sx={{ mt: 1, textAlign: 'right' }}>
                <FeedbackChip helpful={feedback.helpful}>
                  {feedback.helpful ? (
                    <>
                      <ThumbUpIcon fontSize="small" sx={{ mr: 0.5 }} />
                      Hữu ích
                    </>
                  ) : (
                    <>
                      <ThumbDownIcon fontSize="small" sx={{ mr: 0.5 }} />
                      Chưa hữu ích
                    </>
                  )}
                </FeedbackChip>
              </Box>
            ) : (
              <MessageActions>
                <Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>
                  Phản hồi có hữu ích không?
                </Typography>
                <Tooltip title="Hữu ích">
                  <IconButton 
                    size="small" 
                    onClick={() => {
                      if (onProvideFeedback) {
                        onProvideFeedback(id, true);
                      }
                    }}
                  >
                    <ThumbUpIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Không hữu ích">
                  <IconButton 
                    size="small"
                    onClick={() => setFeedbackDialogOpen(true)}
                  >
                    <ThumbDownIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </MessageActions>
            )}
          </AIMessagePaper>
          <MessageTime>{formatTime(timestamp)}</MessageTime>
        </Box>
        
        {/* Feedback dialog */}
        <Dialog open={feedbackDialogOpen} onClose={() => setFeedbackDialogOpen(false)}>
          <DialogTitle>Phản hồi về câu trả lời</DialogTitle>
          <DialogContent>
            <FormControl component="fieldset" sx={{ mb: 2 }}>
              <FormLabel component="legend">Đánh giá của bạn</FormLabel>
              <RadioGroup
                value={feedbackType}
                onChange={(e) => setFeedbackType(e.target.value)}
              >
                <FormControlLabel value="helpful" control={<Radio />} label="Hữu ích" />
                <FormControlLabel value="not_helpful" control={<Radio />} label="Không hữu ích" />
              </RadioGroup>
            </FormControl>
            
            <TextField
              autoFocus
              margin="dense"
              label="Lý do (không bắt buộc)"
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              value={feedbackReason}
              onChange={(e) => setFeedbackReason(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setFeedbackDialogOpen(false)}>Hủy</Button>
            <Button onClick={handleSubmitFeedback} variant="contained">Gửi</Button>
          </DialogActions>
        </Dialog>
      </MessageContainer>
    );
  }

  // Regular AI message
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
            dangerouslySetInnerHTML={{ __html: formatText(content) }}
          />
          
          {/* Feedback section */}
          {feedback ? (
            <Box sx={{ mt: 1, textAlign: 'right' }}>
              <FeedbackChip helpful={feedback.helpful}>
                {feedback.helpful ? (
                  <>
                    <ThumbUpIcon fontSize="small" sx={{ mr: 0.5 }} />
                    Hữu ích
                  </>
                ) : (
                  <>
                    <ThumbDownIcon fontSize="small" sx={{ mr: 0.5 }} />
                    Chưa hữu ích
                  </>
                )}
              </FeedbackChip>
            </Box>
          ) : (
            <MessageActions>
              <Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>
                Phản hồi có hữu ích không?
              </Typography>
              <Tooltip title="Hữu ích">
                <IconButton 
                  size="small" 
                  onClick={() => {
                    if (onProvideFeedback) {
                      onProvideFeedback(id, true);
                    }
                  }}
                >
                  <ThumbUpIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Không hữu ích">
                <IconButton 
                  size="small"
                  onClick={() => setFeedbackDialogOpen(true)}
                >
                  <ThumbDownIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </MessageActions>
          )}
        </AIMessagePaper>
        <MessageTime>{formatTime(timestamp)}</MessageTime>
      </Box>
      
      {/* Feedback dialog */}
      <Dialog open={feedbackDialogOpen} onClose={() => setFeedbackDialogOpen(false)}>
        <DialogTitle>Phản hồi về câu trả lời</DialogTitle>
        <DialogContent>
          <FormControl component="fieldset" sx={{ mb: 2 }}>
            <FormLabel component="legend">Đánh giá của bạn</FormLabel>
            <RadioGroup
              value={feedbackType}
              onChange={(e) => setFeedbackType(e.target.value)}
            >
              <FormControlLabel value="helpful" control={<Radio />} label="Hữu ích" />
              <FormControlLabel value="not_helpful" control={<Radio />} label="Không hữu ích" />
            </RadioGroup>
          </FormControl>
          
          <TextField
            autoFocus
            margin="dense"
            label="Lý do (không bắt buộc)"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={feedbackReason}
            onChange={(e) => setFeedbackReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFeedbackDialogOpen(false)}>Hủy</Button>
          <Button onClick={handleSubmitFeedback} variant="contained">Gửi</Button>
        </DialogActions>
      </Dialog>
    </MessageContainer>
  );
};

export default ChatMessage;