import { Roles } from '@/common/constants/roles';
import { generateDashboardData, courseOptions } from '@/mockData/classDashboardData';
import { User, Conversation, Message } from '@/pages/chat/types';

// Tạo avatar ngẫu nhiên cho sinh viên
const getRandomAvatar = (): string => {
  const avatars = [
    'https://cdn.tech24.vn/upload/tech24_vn/post/images/2024/09/26/675/avatar-vo-tri-2.jpg',
    'https://mayvesinhmienbac.com.vn/wp-content/uploads/2024/10/avatar-vo-tri-meo-110uGFjUE.jpg',
    'https://anhtoc.vn/wp-content/uploads/2024/09/anh-meo-vo-tri-cute.webp',
    'https://anhnghethuatvietnam2022.com/wp-content/uploads/2024/11/anh-avatar-vo-tri-27.jpg',
    'https://auvi.edu.vn/wp-content/uploads/2025/02/avatar-meo-vo-tri-25.jpg',
  ];
  return avatars[Math.floor(Math.random() * avatars.length)];
};

// Tạo trạng thái ngẫu nhiên cho sinh viên
const getRandomStatus = (): 'online' | 'offline' | 'away' => {
  const statuses: ('online' | 'offline' | 'away')[] = ['online', 'offline', 'away'];
  return statuses[Math.floor(Math.random() * statuses.length)];
};

// Tạo thời gian hoạt động ngẫu nhiên
const getRandomLastActive = (): string => {
  const randomHours = Math.floor(Math.random() * 24);
  return new Date(Date.now() - randomHours * 60 * 60 * 1000).toISOString();
};

// Tạo danh sách người dùng từ dữ liệu lớp học
export const generateUsersFromClassData = (classId: string, semesterId: string = 'SUM2024'): User[] => {
  const dashboardData = generateDashboardData(classId, semesterId);
  const users: User[] = [];

  // Thêm giáo viên
  users.push({
    id: 'teacher1',
    name: `${dashboardData.classInfo.instructor.title} ${dashboardData.classInfo.instructor.name}`,
    email: 'teacher1@edu.vn',
    role: Roles.TEACHER,
    status: 'online',
    lastActive: new Date().toISOString(),
    avatar: 'https://mui.com/static/images/avatar/6.jpg',
  });

  // Thêm trợ giảng nếu có
  if (dashboardData.classInfo.assistant) {
    users.push({
      id: 'assistant1',
      name: `${dashboardData.classInfo.assistant.title} ${dashboardData.classInfo.assistant.name}`,
      email: 'assistant1@edu.vn',
      role: Roles.TEACHER,
      status: 'online',
      lastActive: new Date().toISOString(),
      avatar: 'https://mui.com/static/images/avatar/5.jpg',
    });
  }

  // Thêm sinh viên
  dashboardData.students.forEach(student => {
    users.push({
      id: student.mssv,
      name: student.name,
      email: `${student.mssv}@student.edu.vn`,
      role: Roles.STUDENT,
      status: getRandomStatus(),
      lastActive: getRandomLastActive(),
      avatar: getRandomAvatar(),
    });
  });

  return users;
};

// Tạo cuộc trò chuyện mẫu cho mỗi sinh viên
export const generateConversationsFromUsers = (users: User[], currentUserId: string = 'teacher1'): Conversation[] => {
  const conversations: Conversation[] = [];
  
  // Lọc ra danh sách sinh viên
  const students = users.filter(user => user.role === Roles.STUDENT);
  
  // Tạo cuộc trò chuyện cho mỗi sinh viên
  students.forEach((student, index) => {
    // Tạo tin nhắn mẫu
    const messages: Message[] = [
      {
        id: `msg_${student.id}_1`,
        sender: currentUserId,
        senderType: 'teacher',
        content: `Chào ${student.name}, bạn đang làm bài tập đến đâu rồi?`,
        timestamp: new Date(Date.now() - (index + 1) * 60 * 60 * 1000).toISOString(),
        isRead: true,
      }
    ];
    
    // Thêm phản hồi từ sinh viên cho một số sinh viên
    if (index % 2 === 0) {
      messages.push({
        id: `msg_${student.id}_2`,
        sender: student.id,
        senderType: 'student',
        content: 'Thưa thầy, em đang làm bài tập về vòng lặp ạ.',
        timestamp: new Date(Date.now() - (index + 0.9) * 60 * 60 * 1000).toISOString(),
        isRead: true,
      });
    }
    
    // Tạo cuộc trò chuyện
    conversations.push({
      id: `conv_${student.id}`,
      participants: [currentUserId, student.id],
      messages: messages,
      lastMessage: messages[messages.length - 1],
      unreadCount: index % 3 === 0 ? 1 : 0, // Một số cuộc trò chuyện có tin nhắn chưa đọc
    });
  });
  
  return conversations;
};

// Lấy ID lớp từ tên lớp
export const getClassIdFromName = (className: string): string => {
  const course = courseOptions.find(course => course.name === className);
  return course ? course.id : 'C01'; // Mặc định là C01 nếu không tìm thấy
};

// Lấy tên lớp từ ID lớp
export const getClassNameFromId = (classId: string): string => {
  const course = courseOptions.find(course => course.id === classId);
  return course ? course.name : 'C Programming - C01'; // Mặc định nếu không tìm thấy
};