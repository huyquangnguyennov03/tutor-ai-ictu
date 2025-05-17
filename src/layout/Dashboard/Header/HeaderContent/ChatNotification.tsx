import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';

// project imports
import NotificationBase from './NotificationBase';
import chatNotificationService from '@/services/chatNotificationService';

// assets
import CommentOutlined from '@ant-design/icons/CommentOutlined';

// types
import { Conversation, Message } from '@/pages/chat/types';

// Helper function to format time
const formatTimeAgo = (timestamp: string): string => {
  const now = new Date();
  const messageTime = new Date(timestamp);
  const diffInSeconds = Math.floor((now.getTime() - messageTime.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'Vừa xong';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} phút trước`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} giờ trước`;
  } else if (diffInSeconds < 172800) {
    return 'Hôm qua';
  } else {
    return messageTime.toLocaleDateString();
  }
};

// Format time for display (HH:MM AM/PM)
const formatTime = (timestamp: string): string => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Interface for chat notification message
interface ChatNotificationMessage {
  id: string;
  student: {
    id: string;
    name: string;
    status: 'online' | 'offline' | 'away';
  };
  message: string;
  time: string;
  timestamp: string;
  read: boolean;
  conversationId: string;
}

const avatarSX = {
  width: 40,
  height: 40,
  fontSize: '1rem'
};

// ==============================|| HEADER CONTENT - STUDENT CHAT NOTIFICATION ||============================== //

export default function ChatNotification() {
  const navigate = useNavigate();
  const [unread, setUnread] = useState<number>(0);
  const [messages, setMessages] = useState<ChatNotificationMessage[]>([]);

  // Convert conversations to notification messages
  const convertToNotificationMessages = (conversations: Conversation[]): ChatNotificationMessage[] => {
    const notificationMessages: ChatNotificationMessage[] = [];
    const processedStudentIds = new Set<string>();

    // Sort conversations by last message timestamp (newest first)
    const sortedConversations = [...conversations].sort((a, b) => {
      const timestampA = a.lastMessage?.timestamp || '';
      const timestampB = b.lastMessage?.timestamp || '';
      return new Date(timestampB).getTime() - new Date(timestampA).getTime();
    });

    for (const conversation of sortedConversations) {
      // Skip conversations without messages or last message
      if (!conversation.messages.length || !conversation.lastMessage) continue;

      // Find the student in the conversation (non-teacher participant)
      const studentId = conversation.participants.find(id => id !== 'teacher1');
      if (!studentId) continue;

      // Skip if we already processed this student (to avoid duplicates)
      if (processedStudentIds.has(studentId)) continue;

      // Get student info
      const student = chatNotificationService.getUserById(studentId);
      if (!student) continue;

      // Get the last message from the student if exists, otherwise use last message in conversation
      const lastStudentMessage = conversation.messages
        .filter(msg => msg.sender === studentId)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];

      const messageToUse = lastStudentMessage || conversation.lastMessage;

      // Track that we've processed this student
      processedStudentIds.add(studentId);

      // Create notification message
      notificationMessages.push({
        id: messageToUse.id,
        student: {
          id: student.id,
          name: student.name,
          status: student.status
        },
        message: messageToUse.content,
        time: formatTimeAgo(messageToUse.timestamp),
        timestamp: formatTime(messageToUse.timestamp),
        read: messageToUse.isRead || false,
        conversationId: conversation.id
      });

      // Limit to 5 students
      if (notificationMessages.length >= 5) break;
    }

    return notificationMessages;
  };

  // Xử lý và cập nhật tin nhắn ngay khi có thay đổi
  const handleConversationUpdate = () => {
    // Lấy danh sách cuộc trò chuyện mới nhất
    const conversations = chatNotificationService.getConversations();

    // Chuyển đổi thành thông báo và sắp xếp theo thời gian (mới nhất lên đầu)
    const notificationMessages = convertToNotificationMessages(conversations);

    // Cập nhật danh sách tin nhắn
    setMessages(notificationMessages);

    // Cập nhật số lượng tin chưa đọc
    const unreadCount = conversations.reduce((count, conv) => {
      return count + (conv.unreadCount || 0);
    }, 0);

    setUnread(unreadCount);
  };

  // Load conversations on mount
  useEffect(() => {
    // Get initial conversations
    handleConversationUpdate();

    // Listen for new messages
    const handleNewMessage = (data: { message: Message, conversation: Conversation }) => {
      // Update messages immediately when there's a new message
      handleConversationUpdate();
    };

    // Listen for message read events
    const handleMessageRead = () => {
      // Update messages
      handleConversationUpdate();
    };

    // Register event listeners
    chatNotificationService.addEventListener('newMessage', handleNewMessage);
    chatNotificationService.addEventListener('messageRead', handleMessageRead);
    chatNotificationService.addEventListener('conversationUpdate', handleConversationUpdate);

    // Cleanup on unmount
    return () => {
      chatNotificationService.removeEventListener('newMessage', handleNewMessage);
      chatNotificationService.removeEventListener('messageRead', handleMessageRead);
      chatNotificationService.removeEventListener('conversationUpdate', handleConversationUpdate);
    };
  }, []);

  const markAllAsRead = () => {
    // Mark all conversations as read
    chatNotificationService.getConversations().forEach(conversation => {
      chatNotificationService.markMessagesAsRead(conversation.id);
    });

    // Update local state
    setUnread(0);
    setMessages(messages.map(msg => ({ ...msg, read: true })));
  };

  const navigateToChat = () => {
    navigate('/chat'); // Navigate to the chat page
  };

  const handleMessageClick = (messageId: string, conversationId: string, studentId: string) => {
    // Mark conversation as read
    chatNotificationService.markMessagesAsRead(conversationId);

    // Mark the specific message as read locally
    setMessages(
      messages.map(msg =>
        msg.id === messageId ? { ...msg, read: true } : msg
      )
    );

    // Update unread count
    setUnread(prev => Math.max(0, prev - 1));

    // Navigate to chat with the specific student
    navigate(`/chat?studentId=${studentId}`);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <NotificationBase
      icon={<CommentOutlined />}
      unreadCount={unread}
      title="Tin nhắn từ sinh viên"
      badgeColor="error"
      onMarkAllRead={markAllAsRead}
      viewAllAction={navigateToChat}
      viewAllText="Xem tất cả tin nhắn"
    >
      {/* Messages Header */}
      <Box sx={{ p: 1 }}>
        <Typography variant="subtitle2" sx={{ px: 1, py: 0.5 }}>
          Tin nhắn gần đây:
        </Typography>
      </Box>

      <Divider />

      {/* Messages */}
      {messages.length === 0 ? (
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Không có tin nhắn mới
          </Typography>
        </Box>
      ) : (
        messages.map((msg) => (
          <ListItem
            key={msg.id}
            component={ListItemButton}
            divider
            selected={!msg.read}
            onClick={() => handleMessageClick(msg.id, msg.conversationId, msg.student.id)}
            sx={{
              bgcolor: !msg.read ? 'primary.lighter' : 'inherit',
              '&:hover': {
                bgcolor: !msg.read ? 'primary.lighter' : 'action.hover',
              }
            }}
          >
            <ListItemAvatar>
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      bgcolor: msg.student.status === 'online' ? '#4caf50' : '#bdbdbd',
                      border: '2px solid white'
                    }}
                  />
                }
              >
                <Avatar
                  sx={{
                    ...avatarSX,
                    bgcolor: !msg.read ? 'primary.main' : 'primary.light',
                    color: 'white'
                  }}
                >
                  {getInitials(msg.student.name)}
                </Avatar>
              </Badge>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="subtitle1" fontWeight={!msg.read ? 600 : 500}>
                    {msg.student.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {msg.timestamp}
                  </Typography>
                </Box>
              }
              secondary={
                <Box sx={{ mt: 0.5 }}>
                  <Typography
                    variant="body2"
                    noWrap
                    sx={{
                      maxWidth: { xs: '120px', md: '220px' },
                      fontWeight: !msg.read ? 500 : 400
                    }}
                  >
                    {msg.message}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>
                      {msg.student.id}
                    </Typography>
                    <Chip
                      label={msg.student.status === 'online' ? 'Online' : 'Offline'}
                      size="small"
                      color={msg.student.status === 'online' ? 'success' : 'default'}
                      variant="outlined"
                      sx={{
                        height: 20,
                        '& .MuiChip-label': {
                          px: 1,
                          fontSize: '0.625rem',
                          fontWeight: 500
                        }
                      }}
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                      {msg.time}
                    </Typography>
                  </Box>
                </Box>
              }
            />
          </ListItem>
        ))
      )}
    </NotificationBase>
  );
}