import { useState } from 'react';
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

// project imports
import NotificationBase from './NotificationBase';

// assets
import CommentOutlined from '@ant-design/icons/CommentOutlined';

// types
import { Student } from '@/pages/chat/types'; // Ensure this type is defined in your project

// Sample student messages for demo
const studentChatMessages = [
  {
    id: '1',
    student: { id: '22520001', name: 'Nguyễn Văn A', status: 'online' },
    message: 'Cảm ơn thầy, em đã hiểu vấn đề rồi. Em sẽ sửa lại code.',
    time: '2 min ago',
    timestamp: '9:45 AM',
    read: false
  },
  {
    id: '2',
    student: { id: '22520002', name: 'Trần Thị B', status: 'offline' },
    message: 'Em còn thắc mắc về phần quản lý bộ nhớ ạ, em có thể hỏi thêm không?',
    time: '1 hour ago',
    timestamp: '8:30 AM',
    read: false
  },
  {
    id: '3',
    student: { id: '22520003', name: 'Lê Văn C', status: 'offline' },
    message: 'Em không hiểu tại sao phải dùng free() sau khi malloc?',
    time: 'Yesterday',
    timestamp: '4:15 PM',
    read: true
  },
  {
    id: '4',
    student: { id: '22520005', name: 'Võ Minh E', status: 'offline' },
    message: 'Em đã nộp bài tập rồi ạ. Thầy xem và cho em nhận xét với ạ.',
    time: 'Yesterday',
    timestamp: '11:20 AM',
    read: true
  }
];

const avatarSX = {
  width: 40,
  height: 40,
  fontSize: '1rem'
};

// ==============================|| HEADER CONTENT - STUDENT CHAT NOTIFICATION ||============================== //

export default function ChatNotification() {
  const navigate = useNavigate();
  const [unread, setUnread] = useState<number>(2); // Number of unread messages
  const [messages, setMessages] = useState(studentChatMessages);

  const markAllAsRead = () => {
    setUnread(0);
    setMessages(messages.map(msg => ({ ...msg, read: true })));
  };

  const navigateToChat = () => {
    navigate('/chat'); // Navigate to the chat page
  };

  const handleMessageClick = (messageId: string) => {
    // Mark the specific message as read
    setMessages(
      messages.map(msg =>
        msg.id === messageId ? { ...msg, read: true } : msg
      )
    );

    // Update unread count
    const unreadCount = messages.filter(msg => msg.id !== messageId && !msg.read).length;
    setUnread(unreadCount);

    // Navigate to chat with the specific student
    const selectedMessage = messages.find(msg => msg.id === messageId);
    if (selectedMessage) {
      navigate(`/chat?studentId=${selectedMessage.student.id}`);
    }
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
      {messages.map((msg) => (
        <ListItem
          key={msg.id}
          component={ListItemButton}
          divider
          selected={!msg.read}
          onClick={() => handleMessageClick(msg.id)}
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
      ))}
    </NotificationBase>
  );
}