import { useState, useEffect } from 'react';

// material-ui
import Avatar from '@mui/material/Avatar';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

// project imports
import NotificationBase from './NotificationBase';
import { useAppSelector } from '@/redux/hooks';
import { selectRole } from '@/redux/slices/authSlice';
import { Roles } from '@/common/constants/roles';
import { 
  selectWarnings, 
  selectStudentsNeedingSupport,
  selectAssignments
} from '@/redux/slices/teacherDashboardSlice';

// assets
import BellOutlined from '@ant-design/icons/BellOutlined';
import GiftOutlined from '@ant-design/icons/GiftOutlined';
import MessageOutlined from '@ant-design/icons/MessageOutlined';
import SettingOutlined from '@ant-design/icons/SettingOutlined';
import FileOutlined from '@ant-design/icons/FileOutlined';
import CalendarOutlined from '@ant-design/icons/CalendarOutlined';
import CheckCircleOutlined from '@ant-design/icons/CheckCircleOutlined';
import WarningOutlined from '@ant-design/icons/WarningOutlined';
import BookOutlined from '@ant-design/icons/BookOutlined';

// types
import { ReactNode } from 'react';

// interfaces
interface NotificationItem {
  id: string;
  avatar: ReactNode | string;
  avatarColor: {
    color: string;
    bgcolor: string;
  };
  title: ReactNode;
  subtitle: string;
  time: string;
  timestamp: string;
  read: boolean;
}

// Thông báo cho giáo viên
const teacherNotifications: NotificationItem[] = [
  {
    id: '1',
    avatar: <FileOutlined />,
    avatarColor: { color: 'warning.main', bgcolor: 'warning.lighter' },
    title: (
      <>
        <Typography component="span" variant="subtitle1">
          Bài tập #5
        </Typography>{' '}
        đã đến hạn nộp
      </>
    ),
    subtitle: 'Có 5 học sinh chưa nộp bài',
    time: '10:00 AM',
    timestamp: '10:00 AM',
    read: false
  },
  {
    id: '2',
    avatar: <WarningOutlined />,
    avatarColor: { color: 'error.main', bgcolor: 'error.lighter' },
    title: (
      <>
        <Typography component="span" variant="subtitle1">
          Cảnh báo học tập
        </Typography>
      </>
    ),
    subtitle: '3 học sinh có nguy cơ trượt môn',
    time: '2 giờ trước',
    timestamp: '2 giờ trước',
    read: false
  },
  {
    id: '3',
    avatar: <CalendarOutlined />,
    avatarColor: { color: 'info.main', bgcolor: 'info.lighter' },
    title: (
      <>
        <Typography component="span" variant="subtitle1">
          Lịch dạy
        </Typography>{' '}
        tuần tới đã được cập nhật
      </>
    ),
    subtitle: 'Thứ 2: Lớp A1, Thứ 3: Lớp B2...',
    time: '1 ngày trước',
    timestamp: '1 ngày trước',
    read: true
  },
  {
    id: '4',
    avatar: <CheckCircleOutlined />,
    avatarColor: { color: 'success.main', bgcolor: 'success.lighter' },
    title: (
      <>
        Đã chấm xong{' '}
        <Typography component="span" variant="subtitle1">
          Bài kiểm tra giữa kỳ
        </Typography>
      </>
    ),
    subtitle: 'Điểm trung bình lớp: 7.5/10',
    time: '2 ngày trước',
    timestamp: '2 ngày trước',
    read: true
  }
];

// Thông báo cho học sinh
const studentNotifications: NotificationItem[] = [
  {
    id: '1',
    avatar: <FileOutlined />,
    avatarColor: { color: 'error.main', bgcolor: 'error.lighter' },
    title: (
      <>
        <Typography component="span" variant="subtitle1">
          Deadline sắp hết hạn
        </Typography>
      </>
    ),
    subtitle: 'Bài tập #5 cần nộp trong 2 ngày nữa',
    time: '30 phút trước',
    timestamp: '30 phút trước',
    read: false
  },
  {
    id: '2',
    avatar: <CheckCircleOutlined />,
    avatarColor: { color: 'success.main', bgcolor: 'success.lighter' },
    title: (
      <>
        <Typography component="span" variant="subtitle1">
          Bài tập #4
        </Typography>{' '}
        đã được chấm điểm
      </>
    ),
    subtitle: 'Điểm số: 8.5/10',
    time: '3 giờ trước',
    timestamp: '3 giờ trước',
    read: false
  },
  {
    id: '3',
    avatar: <BookOutlined />,
    avatarColor: { color: 'primary.main', bgcolor: 'primary.lighter' },
    title: (
      <>
        <Typography component="span" variant="subtitle1">
          Tài liệu mới
        </Typography>{' '}
        đã được thêm vào khóa học
      </>
    ),
    subtitle: 'Chương 5: Lập trình hướng đối tượng',
    time: '1 ngày trước',
    timestamp: '1 ngày trước',
    read: true
  },
  {
    id: '4',
    avatar: <CalendarOutlined />,
    avatarColor: { color: 'info.main', bgcolor: 'info.lighter' },
    title: (
      <>
        <Typography component="span" variant="subtitle1">
          Nhắc nhở
        </Typography>{' '}
        kiểm tra giữa kỳ
      </>
    ),
    subtitle: 'Kiểm tra diễn ra vào thứ 5 tuần sau',
    time: '2 ngày trước',
    timestamp: '2 ngày trước',
    read: true
  },
  {
    id: '5',
    avatar: <WarningOutlined />,
    avatarColor: { color: 'warning.main', bgcolor: 'warning.lighter' },
    title: (
      <>
        <Typography component="span" variant="subtitle1">
          Cảnh báo học tập
        </Typography>
      </>
    ),
    subtitle: 'Bạn đã bỏ lỡ 2 buổi học liên tiếp',
    time: '3 ngày trước',
    timestamp: '3 ngày trước',
    read: true
  }
];

const avatarSX = {
  width: 36,
  height: 36,
  fontSize: '1rem'
};

// ==============================|| HEADER CONTENT - NOTIFICATION ||============================== //

export default function Notification() {
  const userRole = useAppSelector(selectRole);
  const isTeacher = userRole === Roles.TEACHER;
  
  // Lấy dữ liệu từ Redux store
  const studentWarnings = useAppSelector(selectWarnings);
  const studentsNeedingSupport = useAppSelector(selectStudentsNeedingSupport);
  const assignments = useAppSelector(selectAssignments);
  
  // Khởi tạo thông báo dựa trên vai trò
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [read, setRead] = useState<number>(0);
  
  // Cập nhật thông báo khi vai trò thay đổi hoặc dữ liệu thay đổi
  useEffect(() => {
    if (isTeacher) {
      // Tạo thông báo từ dữ liệu cảnh báo
      const warningNotifications: NotificationItem[] = [];
      
      // Thêm thông báo cho sinh viên cần hỗ trợ (điểm < 2)
      if (studentsNeedingSupport && studentsNeedingSupport.length > 0) {
        warningNotifications.push({
          id: 'support-1',
          avatar: <WarningOutlined />,
          avatarColor: { color: 'error.main', bgcolor: 'error.lighter' },
          title: (
            <>
              <Typography component="span" variant="subtitle1">
                Sinh viên cần hỗ trợ
              </Typography>
            </>
          ),
          subtitle: `${studentsNeedingSupport.length} sinh viên có điểm dưới 2.0`,
          time: 'Hôm nay',
          timestamp: 'Hôm nay',
          read: false
        });
      }
      
      // Thêm thông báo cho các cảnh báo khẩn cấp
      const urgentWarnings = studentWarnings.filter(warning => warning.priority === 'khẩn cấp');
      if (urgentWarnings.length > 0) {
        warningNotifications.push({
          id: 'warning-urgent',
          avatar: <WarningOutlined />,
          avatarColor: { color: 'error.main', bgcolor: 'error.lighter' },
          title: (
            <>
              <Typography component="span" variant="subtitle1">
                Cảnh báo khẩn cấp
              </Typography>
            </>
          ),
          subtitle: `${urgentWarnings.length} sinh viên có nguy cơ trượt môn`,
          time: 'Hôm nay',
          timestamp: 'Hôm nay',
          read: false
        });
      }
      
      // Thêm thông báo cho các cảnh báo thông thường
      const normalWarnings = studentWarnings.filter(warning => warning.priority === 'cảnh báo');
      if (normalWarnings.length > 0) {
        warningNotifications.push({
          id: 'warning-normal',
          avatar: <WarningOutlined />,
          avatarColor: { color: 'warning.main', bgcolor: 'warning.lighter' },
          title: (
            <>
              <Typography component="span" variant="subtitle1">
                Cảnh báo học tập
              </Typography>
            </>
          ),
          subtitle: `${normalWarnings.length} sinh viên cần chú ý`,
          time: 'Hôm nay',
          timestamp: 'Hôm nay',
          read: false
        });
      }
      
      // Thêm thông báo cho deadline sắp hết hạn
      const upcomingAssignments = assignments.filter(a => a.status === 'sắp hết hạn');
      if (upcomingAssignments.length > 0) {
        upcomingAssignments.forEach((assignment, index) => {
          warningNotifications.push({
            id: `assignment-${index}`,
            avatar: <FileOutlined />,
            avatarColor: { color: 'warning.main', bgcolor: 'warning.lighter' },
            title: (
              <>
                <Typography component="span" variant="subtitle1">
                  {assignment.name}
                </Typography>{' '}
                sắp hết hạn
              </>
            ),
            subtitle: `Deadline: ${assignment.deadline}, Đã nộp: ${assignment.completionRate}%`,
            time: 'Hôm nay',
            timestamp: 'Hôm nay',
            read: false
          });
        });
      }
      
      // Kết hợp với các thông báo cố định
      const combinedNotifications = [...warningNotifications, ...teacherNotifications];
      setNotifications(combinedNotifications);
      
      // Đếm số thông báo chưa đọc
      const unreadCount = combinedNotifications.filter(item => !item.read).length;
      setRead(unreadCount);
    } else {
      // Nếu là học sinh, sử dụng thông báo cố định
      setNotifications(studentNotifications);
      
      // Đếm số thông báo chưa đọc
      const unreadCount = studentNotifications.filter(item => !item.read).length;
      setRead(unreadCount);
    }
  }, [isTeacher, studentWarnings, studentsNeedingSupport, assignments]);

  const handleMarkAllRead = () => {
    setRead(0);
    setNotifications(notifications.map(item => ({ ...item, read: true })));
  };

  const handleViewAll = () => {
    console.log('View all notifications');
    // Navigate to notifications page if needed
  };

  return (
    <NotificationBase
      icon={<BellOutlined />}
      unreadCount={read}
      title="Thông báo"
      badgeColor="primary"
      onMarkAllRead={handleMarkAllRead}
      viewAllAction={handleViewAll}
      viewAllText="Xem tất cả"
    >
      {notifications.map((item) => (
        <ListItem
          key={item.id}
          component={ListItemButton}
          divider
          selected={!item.read}
          sx={{
            bgcolor: !item.read ? 'grey.50' : 'inherit',
            py: 1.5,
            '&:hover': {
              bgcolor: !item.read ? 'grey.100' : 'action.hover',
            }
          }}
        >
          <ListItemAvatar>
            <Avatar sx={{ ...avatarSX, ...item.avatarColor }}>
              {item.avatar}
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={
              <Typography
                variant="h6"
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontWeight: !item.read ? 600 : 400
                }}
              >
                <span>{item.title}</span>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  component="span"
                  sx={{ ml: 1 }}
                >
                  {item.timestamp}
                </Typography>
              </Typography>
            }
            secondary={
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontWeight: !item.read ? 500 : 400 }}
              >
                {item.subtitle}
              </Typography>
            }
          />
        </ListItem>
      ))}
    </NotificationBase>
  );
}