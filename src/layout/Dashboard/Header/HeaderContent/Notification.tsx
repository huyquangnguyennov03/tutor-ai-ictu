import { useState } from 'react';

// material-ui
import Avatar from '@mui/material/Avatar';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

// project imports
import NotificationBase from './NotificationBase';

// assets
import BellOutlined from '@ant-design/icons/BellOutlined';
import GiftOutlined from '@ant-design/icons/GiftOutlined';
import MessageOutlined from '@ant-design/icons/MessageOutlined';
import SettingOutlined from '@ant-design/icons/SettingOutlined';

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

// sample notification data
const notificationData: NotificationItem[] = [
  {
    id: '1',
    avatar: <GiftOutlined />,
    avatarColor: { color: 'success.main', bgcolor: 'success.lighter' },
    title: (
      <>
        It&apos;s{' '}
        <Typography component="span" variant="subtitle1">
          Cristina danny&apos;s
        </Typography>{' '}
        birthday today.
      </>
    ),
    subtitle: '2 min ago',
    time: '3:00 AM',
    timestamp: '3:00 AM',
    read: false
  },
  {
    id: '2',
    avatar: <MessageOutlined />,
    avatarColor: { color: 'primary.main', bgcolor: 'primary.lighter' },
    title: (
      <>
        <Typography component="span" variant="subtitle1">
          Aida Burg
        </Typography>{' '}
        commented your post.
      </>
    ),
    subtitle: '5 August',
    time: '6:00 AM',
    timestamp: '6:00 AM',
    read: true
  },
  {
    id: '3',
    avatar: <SettingOutlined />,
    avatarColor: { color: 'error.main', bgcolor: 'error.lighter' },
    title: (
      <>
        Your Profile is Complete &nbsp;
        <Typography component="span" variant="subtitle1">
          60%
        </Typography>
      </>
    ),
    subtitle: '7 hours ago',
    time: '2:45 PM',
    timestamp: '2:45 PM',
    read: false
  },
  {
    id: '4',
    avatar: 'C',
    avatarColor: { color: 'primary.main', bgcolor: 'primary.lighter' },
    title: (
      <>
        <Typography component="span" variant="subtitle1">
          Cristina Danny
        </Typography>{' '}
        invited to join{' '}
        <Typography component="span" variant="subtitle1">
          Meeting.
        </Typography>
      </>
    ),
    subtitle: 'Daily scrum meeting time',
    time: '9:10 PM',
    timestamp: '9:10 PM',
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
  const [read, setRead] = useState<number>(2);
  const [notifications, setNotifications] = useState<NotificationItem[]>(notificationData);

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