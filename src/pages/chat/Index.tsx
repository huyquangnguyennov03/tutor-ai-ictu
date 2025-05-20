import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Grid,
  Box,
  CssBaseline,
  ThemeProvider,
  createTheme,
  useMediaQuery,
  Drawer,
} from '@mui/material';
import StudentList from './StudentList';
import ChatBox from './ChatBox';
import StudentProfile from './StudentProfile';
import ChatToolbar from './ChatToolbar';
import { User, Message, Conversation } from './types';
import { mockStudentProgress } from '../../mockData/mockDataChat';
import socketService from '../../services/socketService';
import { Roles } from '../../common/constants/roles';
import { 
  generateUsersFromClassData, 
  generateConversationsFromUsers, 
  getClassIdFromName 
} from '@/mockData/chatDataUtils';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#4791db',
      dark: '#115293',
    },
    secondary: {
      main: '#f50057',
      light: '#ff4081',
      dark: '#c51162',
    },
    background: {
      default: '#f5f7fa',
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      'Helvetica Neue',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 10px 0 rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

// Mock current user (in a real app, this would come from authentication)
const MOCK_CURRENT_USER: User = {
  id: 'teacher1',
  name: 'Giáo viên Nguyễn Văn X',
  email: 'teacher1@edu.vn',
  role: Roles.TEACHER,
  status: 'online',
  lastActive: new Date().toISOString(),
  avatar: 'https://mui.com/static/images/avatar/6.jpg',
};

const Index: React.FC = () => {
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));

  const [currentClass, setCurrentClass] = useState<string>("C Programming - C01");
  const [currentUser] = useState<User>(MOCK_CURRENT_USER);
  const [users, setUsers] = useState<User[]>(() => 
    generateUsersFromClassData(getClassIdFromName(currentClass))
  );
  const [conversations, setConversations] = useState<Conversation[]>(() => 
    generateConversationsFromUsers(users, currentUser.id)
  );
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [isAITutorEnabled, setIsAITutorEnabled] = useState<boolean>(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState<boolean>(false);

  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, []);

  // Handle URL parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const studentId = params.get('studentId');
    const conversationId = params.get('conversationId');
    
    if (studentId) {
      // Set the selected user from URL parameter
      setSelectedUserId(studentId);
      
      // Mark messages as read if conversationId is provided
      if (conversationId) {
        setConversations(prevConversations =>
          prevConversations.map(conv => {
            if (conv.id === conversationId) {
              const updatedMessages = conv.messages.map(msg => {
                if (msg.sender !== currentUser.id && !msg.isRead) {
                  return { ...msg, isRead: true };
                }
                return msg;
              });

              return {
                ...conv,
                messages: updatedMessages,
                unreadCount: 0,
              };
            }
            return conv;
          })
        );
      }
    }
  }, [location.search, currentUser.id]);

  // Initialize socket connection
  useEffect(() => {
    console.log('Socket would be initialized here in a real app');

    // Setup socket event listeners
    const handleNewMessage = (message: Message) => {
      addMessageToConversation(message);
    };

    const handleTyping = (data: { userId: string; isTyping: boolean }) => {
      if (data.userId === selectedUserId) {
        setIsTyping(data.isTyping);
      }
    };

    const handleUserStatus = (data: { userId: string; status: string }) => {
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === data.userId
            ? { ...user, status: data.status as 'online' | 'offline' | 'away' }
            : user
        )
      );
    };

    // Register event listeners
    socketService.on('message', handleNewMessage);
    socketService.on('typing', handleTyping);
    socketService.on('user_status', handleUserStatus);

    // Cleanup on unmount
    return () => {
      socketService.off('message', handleNewMessage);
      socketService.off('typing', handleTyping);
      socketService.off('user_status', handleUserStatus);
    };
  }, [selectedUserId]);

  // Find the selected user
  const selectedUser = users.find(user => user.id === selectedUserId) || null;

  // Find the conversation with the selected user
  const selectedConversation = conversations.find(
    conversation =>
      conversation.participants.includes(currentUser.id) &&
      selectedUserId !== null && // Check if selectedUserId is not null
      conversation.participants.includes(selectedUserId)
  ) || null;

  // Add a message to a conversation
  const addMessageToConversation = useCallback((message: Message) => {
    const { sender } = message;

    // Xác định đúng người nhận tin nhắn
    let otherUserId: string | null;

    if (sender === currentUser.id) {
      // Nếu người gửi là người dùng hiện tại, người nhận phải là người được chọn
      otherUserId = selectedUserId;
    } else if (sender === 'ai') {
      // Nếu người gửi là AI, thêm vào cuộc trò chuyện hiện tại
      otherUserId = selectedUserId;
    } else {
      // Người gửi là người khác, chính là người nhắn cho mình
      otherUserId = sender;
    }

    setConversations(prevConversations => {
      // Tìm cuộc trò chuyện giữa người dùng hiện tại và người nhận tin nhắn
      const conversationIndex = prevConversations.findIndex(
        conv =>
          conv.participants.includes(currentUser.id) &&
          otherUserId !== null && // Check if otherUserId is not null
          conv.participants.includes(otherUserId)
      );

      if (conversationIndex !== -1) {
        // Cập nhật cuộc trò chuyện đã tồn tại
        const updatedConversations = [...prevConversations];
        const conversation = { ...updatedConversations[conversationIndex] };

        conversation.messages = [...conversation.messages, message];
        conversation.lastMessage = message;

        // Cập nhật số tin nhắn chưa đọc nếu tin nhắn từ người khác
        if (sender !== currentUser.id && (!selectedUserId || selectedUserId !== otherUserId)) {
          conversation.unreadCount = (conversation.unreadCount || 0) + 1;
        }

        updatedConversations[conversationIndex] = conversation;
        return updatedConversations;
      } else if (otherUserId !== null) { // Check if otherUserId is not null before creating a new conversation
        // Tạo cuộc trò chuyện mới
        const newConversation: Conversation = {
          id: `conv_${Date.now()}`,
          participants: [currentUser.id, otherUserId],
          messages: [message],
          lastMessage: message,
          unreadCount: sender !== currentUser.id ? 1 : 0,
        };

        return [...prevConversations, newConversation];
      }

      // If otherUserId is null, return unchanged conversations
      return prevConversations;
    });
  }, [currentUser.id, selectedUserId]);


  // Handle user selection
  const handleSelectUser = (userId: string) => {
    // Store the current scroll position before changing user
    const currentScrollPosition = window.scrollY || window.pageYOffset;

    setSelectedUserId(userId);

    if (isMobile) {
      setMobileDrawerOpen(false);
    }

    // Mark messages as read when selecting a conversation
    setConversations(prevConversations =>
      prevConversations.map(conv => {
        if (
          conv.participants.includes(currentUser.id) &&
          conv.participants.includes(userId)
        ) {
          const updatedMessages = conv.messages.map(msg => {
            if (msg.sender !== currentUser.id && !msg.isRead) {
              return { ...msg, isRead: true };
            }
            return msg;
          });

          return {
            ...conv,
            messages: updatedMessages,
            unreadCount: 0,
          };
        }
        return conv;
      })
    );

    // Maintain scroll position after state update
    requestAnimationFrame(() => {
      window.scrollTo(0, currentScrollPosition);
    });
  };

  // Handle sending a message
  const handleSendMessage = (content: string) => {
    if (!selectedUserId || !content.trim()) return;

    // Tạo tin nhắn mới với người gửi là người dùng hiện tại
    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      sender: currentUser.id,
      senderType: currentUser.role === Roles.TEACHER ? 'teacher' : 'student',
      content: content.trim(),
      timestamp: new Date().toISOString(),
      isRead: false,
    };

    // Thêm tin nhắn vào cuộc trò chuyện
    addMessageToConversation(newMessage);

    // Mô phỏng nhận phản hồi sau một khoảng thời gian (cho mục đích demo)
    setTimeout(() => {
      // Hiển thị đang nhập
      setIsTyping(true);

      setTimeout(() => {
        // Ẩn đang nhập và gửi phản hồi
        setIsTyping(false);

        // Kiểm tra selectedUser và selectedUserId không null trước khi tạo tin nhắn
        if (selectedUser && selectedUserId) {
          // Tạo tin nhắn phản hồi với người gửi là người đang được chọn
          const responseMessage: Message = {
            id: `msg_${Date.now() + 1}`,
            sender: selectedUserId,
            senderType: selectedUser.role === Roles.TEACHER ? 'teacher' : 'student',
            content: `Đây là phản hồi tự động cho tin nhắn: "${content}"`,
            timestamp: new Date().toISOString(),
            isRead: true,
          };

          // Thêm phản hồi vào cuộc trò chuyện
          addMessageToConversation(responseMessage);
        }
      }, 2000); // Mô phỏng nhập trong 2 giây
    }, 1000); // Chờ 1 giây trước khi bắt đầu "nhập"

    // Nếu AI Tutor được bật, đôi khi thêm gợi ý AI
    if (isAITutorEnabled && Math.random() > 0.5) {
      setTimeout(() => {
        const aiResponse: Message = {
          id: `msg_${Date.now() + 2}`,
          sender: 'ai',
          senderType: 'ai',
          content: 'Tôi nhận thấy đây là một lỗi phổ biến liên quan đến quản lý bộ nhớ. Có thể bổ sung thêm kiểm tra NULL sau khi sử dụng malloc để tránh các lỗi không mong muốn.',
          timestamp: new Date().toISOString(),
          isRead: true,
        };

        // Thêm phản hồi AI vào cuộc trò chuyện
        addMessageToConversation(aiResponse);
      }, 3500);
    }
  };

  // Handle typing indicator
  const handleTyping = (isTyping: boolean) => {
    // Clear any existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }

    if (isTyping && selectedUserId) {
      // Set a timeout to stop typing indicator after 3 seconds of inactivity
      typingTimeoutRef.current = setTimeout(() => {
        // socketService.sendTypingIndicator(selectedUserId, false);
      }, 3000);
    }
  };

  const handleToggleAITutor = () => {
    setIsAITutorEnabled(!isAITutorEnabled);

    if (!isAITutorEnabled && selectedUserId) {
      const aiMessage: Message = {
        id: `msg_${Date.now()}`,
        sender: 'ai',
        senderType: 'ai',
        content: 'AI Tutor đã được kích hoạt. Tôi sẽ theo dõi cuộc trò chuyện và cung cấp gợi ý khi cần thiết.',
        timestamp: new Date().toISOString(),
        isRead: true,
      };

      // Add AI message to conversation
      addMessageToConversation(aiMessage);
    }
  };

  const handleClassChange = (className: string) => {
    setCurrentClass(className);
    
    // Cập nhật danh sách người dùng dựa trên lớp học mới
    const classId = getClassIdFromName(className);
    const newUsers = generateUsersFromClassData(classId);
    setUsers(newUsers);
    
    // Cập nhật danh sách cuộc trò chuyện
    const newConversations = generateConversationsFromUsers(newUsers, currentUser.id);
    setConversations(newConversations);
    
    // Reset người dùng được chọn
    setSelectedUserId(null);
  };

  const handleBackToList = () => {
    setSelectedUserId(null);
  };

  const handleOpenDrawer = () => {
    setMobileDrawerOpen(true);
  };

  // Filter users based on current user's role
  const filteredUsers = users.filter(user => {
    return currentUser.role === Roles.TEACHER
      ? user.role === Roles.STUDENT
      : user.role === Roles.TEACHER;
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'background.default',
          height: '85vh',
          overflow: 'auto'
        }}
      >
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <Box sx={{ mb: 1 }}>
            <ChatToolbar
              currentClass={currentClass}
              onClassChange={handleClassChange}
            />
          </Box>

          <Grid
            container
            spacing={2}
            sx={{
              height: 'calc(100vh - 100px)',
              flex: 1,
              overflow: 'hidden'
            }}
          >
            {/* Student List (Left Column) - Hidden on mobile when a user is selected */}
            <Grid
              item
              xs={12}
              md={3}
              lg={3}
              sx={{
                display: {
                  xs: selectedUserId && isMobile ? 'none' : 'block',
                  md: 'block'
                },
                height: '100%',
                overflow: 'hidden'
              }}
            >
              <Box sx={{ height: '100%', overflow: 'hidden' }}>
                <StudentList
                  users={filteredUsers}
                  selectedUserId={selectedUserId}
                  onSelectUser={handleSelectUser}
                  currentUserRole={currentUser.role}
                  conversations={conversations}
                />
              </Box>
            </Grid>

            {/* Chat Box (Center Column) - Full width on mobile when a user is selected */}
            <Grid
              item
              xs={12}
              md={selectedUserId && isTablet ? 9 : 6}
              lg={6}
              sx={{
                display: {
                  xs: !selectedUserId && isMobile ? 'none' : 'block',
                  md: 'block'
                },
                height: '100%',
                overflow: 'hidden'
              }}
            >
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden'
                }}
              >
                <ChatBox
                  className={currentClass}
                  selectedUser={selectedUser}
                  conversation={selectedConversation}
                  messages={selectedConversation?.messages || []}
                  onSendMessage={handleSendMessage}
                  onTyping={handleTyping}
                  onToggleAITutor={handleToggleAITutor}
                  isAITutorEnabled={isAITutorEnabled}
                  isTyping={isTyping}
                  currentUser={currentUser}
                  onOpenUserList={handleOpenDrawer}
                  onBackToList={handleBackToList}
                />
              </Box>
            </Grid>

            {/* Student Profile (Right Column) - Hidden on mobile and tablet when no user is selected */}
            <Grid
              item
              md={3}
              lg={3}
              sx={{
                display: {
                  xs: 'none',
                  md: selectedUserId && isTablet ? 'none' : 'block',
                  lg: 'block'
                },
                height: '100%',
                overflow: 'hidden'
              }}
            >
              <Box sx={{ height: '100%', overflow: 'hidden' }}>
                {selectedUser && (
                  <StudentProfile
                    user={selectedUser}
                    progress={mockStudentProgress}
                    currentUserRole={currentUser.role}
                    currentClass={currentClass}
                  />
                )}
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>

      {/* Mobile Drawer for User List */}
      <Drawer
        anchor="left"
        open={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: '80%', maxWidth: 300 },
        }}
      >
        <Box sx={{ height: '100%', overflow: 'hidden' }}>
          <StudentList
            users={filteredUsers}
            selectedUserId={selectedUserId}
            onSelectUser={handleSelectUser}
            currentUserRole={currentUser.role}
            conversations={conversations}
          />
        </Box>
      </Drawer>
    </ThemeProvider>
  );
};

export default Index;