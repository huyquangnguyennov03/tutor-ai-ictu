import { Roles } from '../common/constants/roles';
import { Conversation, Message, Student, Teacher, User } from '../pages/chat/types';

export const mockUsers: User[] = [
  {
    id: '22520001',
    name: 'Nguyễn Quang Huy',
    email: '22520001@student.edu.vn',
    role: Roles.STUDENT,
    status: 'online',
    lastActive: new Date().toISOString(),
    avatar: 'https://cdn.tech24.vn/upload/tech24_vn/post/images/2024/09/26/675/avatar-vo-tri-2.jpg',
  },
  {
    id: '22520002',
    name: 'Phùng Mạnh Kiên',
    email: '22520002@student.edu.vn',
    role: Roles.STUDENT,
    status: 'offline',
    lastActive: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    avatar: 'https://mayvesinhmienbac.com.vn/wp-content/uploads/2024/10/avatar-vo-tri-meo-110uGFjUE.jpg',
  },
  {
    id: '22520003',
    name: 'Nguyễn Xuân Hòa',
    email: '22520003@student.edu.vn',
    role: Roles.STUDENT,
    status: 'away',
    lastActive: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
    avatar: 'https://anhtoc.vn/wp-content/uploads/2024/09/anh-meo-vo-tri-cute.webp',
  },
  {
    id: '22520004',
    name: 'Phạm Thị Huế',
    email: '22520004@student.edu.vn',
    role: Roles.STUDENT,
    status: 'offline',
    lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    avatar: 'https://anhnghethuatvietnam2022.com/wp-content/uploads/2024/11/anh-avatar-vo-tri-27.jpg',
  },
  {
    id: '22520005',
    name: 'Lễu Mộc Lai',
    email: '22520005@student.edu.vn',
    role: Roles.STUDENT,
    status: 'offline',
    lastActive: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    avatar: 'https://auvi.edu.vn/wp-content/uploads/2025/02/avatar-meo-vo-tri-25.jpg',
  },
  {
    id: 'teacher1',
    name: 'Giáo viên Nguyễn Văn X',
    email: 'teacher1@edu.vn',
    role: Roles.TEACHER,
    status: 'online',
    lastActive: new Date().toISOString(),
    avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7wqd4R2yKC8t-wbUjY6LfUUHRJxtdaN6WHQ&s',
  },
];

export const mockMessages: Message[] = [
  {
    id: '1',
    sender: 'teacher1',
    senderType: 'teacher',
    content: 'Hãy sửa vòng lặp thành i < n thay vì i <= n.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    isRead: true,
  },
  {
    id: '2',
    sender: '22520001',
    senderType: 'student',
    content: 'Cảm ơn thầy, em đã hiểu vấn đề rồi. Em sẽ sửa lại code.',
    timestamp: new Date(Date.now() - 1.9 * 60 * 60 * 1000).toISOString(), // 1.9 hours ago
    isRead: true,
  },
  {
    id: '3',
    sender: 'teacher1',
    senderType: 'teacher',
    content: 'Không có gì. Bạn cũng đừng quên giải phóng bộ nhớ sau khi sử dụng malloc bằng cách gọi free(arr) trước khi kết thúc hàm main nhé.',
    timestamp: new Date(Date.now() - 1.8 * 60 * 60 * 1000).toISOString(), // 1.8 hours ago
    isRead: true,
  },
  {
    id: '4',
    sender: 'ai',
    senderType: 'ai',
    content: 'Suggestion: Tôi có thể cung cấp thêm ví dụ về cách sử dụng malloc đúng cách và giải thích về lỗi buffer overflow nếu sinh viên cần hiểu sâu hơn về vấn đề này.',
    timestamp: new Date(Date.now() - 1.7 * 60 * 60 * 1000).toISOString(), // 1.7 hours ago
    isRead: true,
  },
  {
    id: '5',
    sender: 'teacher1',
    senderType: 'teacher',
    content: 'Bạn có thể gửi code đã sửa cho tôi xem không?',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
    isRead: false,
  },
  {
    id: '6',
    sender: 'teacher1',
    senderType: 'teacher',
    content: 'Khi nào bạn hoàn thành bài tập, hãy gửi cho tôi để tôi kiểm tra.',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    isRead: true,
  },
  {
    id: '7',
    sender: '22520002',
    senderType: 'student',
    content: 'Thưa thầy, em đã nộp bài tập rồi ạ.',
    timestamp: new Date(Date.now() - 4.9 * 60 * 60 * 1000).toISOString(), // 4.9 hours ago
    isRead: true,
  },
  {
    id: '8',
    sender: 'teacher1',
    senderType: 'teacher',
    content: 'Tốt, tôi sẽ kiểm tra và phản hồi sớm.',
    timestamp: new Date(Date.now() - 4.8 * 60 * 60 * 1000).toISOString(), // 4.8 hours ago
    isRead: true,
  },
  {
    id: '9',
    sender: '22520003',
    senderType: 'student',
    content: 'Thầy ơi, em gặp lỗi segmentation fault khi chạy chương trình. Em không biết làm sao để sửa ạ.',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
    isRead: false,
  },
];

export const mockConversations: Conversation[] = [
  {
    id: '1',
    participants: ['teacher1', '22520001'],
    messages: mockMessages.filter(
      (message) =>
        (message.sender === 'teacher1' && ['1', '3', '5'].includes(message.id)) ||
        (message.sender === '22520001' && ['2'].includes(message.id)) ||
        (message.sender === 'ai' && ['4'].includes(message.id))
    ),
    lastMessage: mockMessages.find(message => message.id === '5'),
    unreadCount: 1,
  },
  {
    id: '2',
    participants: ['teacher1', '22520002'],
    messages: mockMessages.filter(
      (message) =>
        (message.sender === 'teacher1' && ['6', '8'].includes(message.id)) ||
        (message.sender === '22520002' && ['7'].includes(message.id))
    ),
    lastMessage: mockMessages.find(message => message.id === '8'),
    unreadCount: 0,
  },
  {
    id: '3',
    participants: ['teacher1', '22520003'],
    messages: mockMessages.filter(
      (message) =>
        (message.sender === '22520003' && ['9'].includes(message.id))
    ),
    lastMessage: mockMessages.find(message => message.id === '9'),
    unreadCount: 1,
  },
];

export const mockStudentProgress = {
  currentScore: 8.5,
  totalScore: 10,
  currentChapter: 5,
  totalChapters: 10,
  completionPercentage: 60,
};