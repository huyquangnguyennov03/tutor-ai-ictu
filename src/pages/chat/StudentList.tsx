import React, { useState } from 'react';
import {
  Box,
  List,
  TextField,
  InputAdornment,
  Typography,
  Divider,
  Chip,
  IconButton,
  Tooltip,
  Paper,
  Badge,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  ListItemButton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import PersonIcon from '@mui/icons-material/Person';
import CircleIcon from '@mui/icons-material/Circle';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { User, Conversation } from './types';
import { Roles } from '../../common/constants/roles';
import { format, formatDistanceToNow, isToday, isYesterday } from 'date-fns';
import { vi } from 'date-fns/locale';

interface StudentListProps {
  users: User[];
  selectedUserId: string | null;
  onSelectUser: (userId: string) => void;
  currentUserRole: Roles;
  conversations?: Conversation[];
}

const StudentList: React.FC<StudentListProps> = ({
  users,
  selectedUserId,
  onSelectUser,
  currentUserRole,
  conversations = []
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filter, setFilter] = useState<string>('all');

  const handleSearchChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterChange = (value: string) => {
    setFilter(value);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  let displayedUsers = [...filteredUsers];

  // Apply filters
  if (filter === 'online') {
    displayedUsers = displayedUsers.filter(
      (user) => user.status === 'online'
    );
  } else if (filter === 'offline') {
    displayedUsers = displayedUsers.filter(
      (user) => user.status === 'offline' || user.status === 'away'
    );
  }

  const onlineCount = users.filter(
    (user) => user.status === 'online'
  ).length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return '#4caf50';
      case 'away':
        return '#ff9800';
      case 'offline':
      default:
        return '#bdbdbd';
    }
  };

  const formatLastMessage = (conversation?: Conversation) => {
    if (!conversation || !conversation.lastMessage) return '';

    const { content, timestamp } = conversation.lastMessage;
    const messageDate = new Date(timestamp);

    let timeStr = '';
    if (isToday(messageDate)) {
      timeStr = format(messageDate, 'HH:mm');
    } else if (isYesterday(messageDate)) {
      timeStr = 'Hôm qua';
    } else {
      timeStr = format(messageDate, 'dd/MM');
    }

    return `${content.length > 25 ? content.substring(0, 25) + '...' : content} · ${timeStr}`;
  };

  const getConversationWithUser = (userId: string) => {
    return conversations.find(
      conv => conv.participants.includes(userId)
    );
  };

  const getUnreadCount = (userId: string) => {
    const conversation = getConversationWithUser(userId);
    return conversation?.unreadCount || 0;
  };

  const formatLastActive = (lastActive?: string) => {
    if (!lastActive) return '';

    const date = new Date(lastActive);
    return formatDistanceToNow(date, { addSuffix: true, locale: vi });
  };

  const userTypeLabel = currentUserRole === Roles.TEACHER ? 'Sinh viên' : 'Giáo viên';

  return (
    <Paper
      elevation={0}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        border: '1px solid rgba(0, 0, 0, 0.08)',
        overflow: 'hidden'
      }}
    >
      <Box
        sx={{
          p: 2,
          bgcolor: 'primary.main',
          color: 'white'
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {userTypeLabel}
          </Typography>
          <Tooltip title="Làm mới danh sách">
            <IconButton size="small" sx={{ color: 'white' }}>
              <RefreshIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <PersonIcon fontSize="small" sx={{ mr: 0.5 }} />
            <Typography variant="body2">
              {users.length} {userTypeLabel.toLowerCase()}
            </Typography>
          </Box>
          <Divider orientation="vertical" flexItem sx={{ mx: 1, bgcolor: 'rgba(255,255,255,0.3)' }} />
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CircleIcon sx={{ color: '#4caf50', fontSize: 10, mr: 0.5 }} />
            <Typography variant="body2">
              {onlineCount} online
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ p: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.08)' }}>
        <TextField
          fullWidth
          placeholder={`Tìm kiếm ${userTypeLabel.toLowerCase()}...`}
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" color="action" />
              </InputAdornment>
            ),
          }}
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              '&:hover fieldset': {
                borderColor: 'primary.main',
              },
            }
          }}
        />

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          <Chip
            label="Tất cả"
            clickable
            color={filter === 'all' ? 'primary' : 'default'}
            variant={filter === 'all' ? 'filled' : 'outlined'}
            onClick={() => handleFilterChange('all')}
            sx={{ fontWeight: 500 }}
          />
          <Chip
            icon={<CircleIcon sx={{ fontSize: '12px !important', color: filter === 'online' ? 'inherit' : '#4caf50' }} />}
            label="Online"
            clickable
            color={filter === 'online' ? 'success' : 'default'}
            variant={filter === 'online' ? 'filled' : 'outlined'}
            onClick={() => handleFilterChange('online')}
            sx={{ fontWeight: 500 }}
          />
          <Chip
            icon={<CircleIcon sx={{ fontSize: '12px !important', color: filter === 'offline' ? 'inherit' : '#bdbdbd' }} />}
            label="Offline"
            clickable
            color={filter === 'offline' ? 'default' : 'default'}
            variant={filter === 'offline' ? 'filled' : 'outlined'}
            onClick={() => handleFilterChange('offline')}
            sx={{ fontWeight: 500 }}
          />
        </Box>
      </Box>

      <Box
        sx={{
          flexGrow: 1,
          overflow: 'auto',
          bgcolor: 'background.default'
        }}
      >
        {displayedUsers.length > 0 ? (
          <List disablePadding>
            {displayedUsers.map((user) => {
              const conversation = getConversationWithUser(user.id);
              const unreadCount = getUnreadCount(user.id);

              return (
                <ListItemButton
                  key={user.id}
                  selected={user.id === selectedUserId}
                  onClick={() => onSelectUser(user.id)}
                  sx={{
                    py: 1.5,
                    px: 2,
                    borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
                    '&.Mui-selected': {
                      backgroundColor: 'primary.lighter',
                    },
                    '&.Mui-selected:hover': {
                      backgroundColor: 'primary.lighter',
                    },
                  }}
                >
                  <ListItemAvatar>
                    <Badge
                      overlap="circular"
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                      badgeContent={
                        <FiberManualRecordIcon
                          sx={{
                            color: getStatusColor(user.status),
                            fontSize: 12,
                          }}
                        />
                      }
                    >
                      <Avatar src={user.avatar} alt={user.name}>
                        {user.name.charAt(0)}
                      </Avatar>
                    </Badge>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="subtitle1" fontWeight={unreadCount > 0 ? 'bold' : 'medium'}>
                          {user.name}
                        </Typography>
                        {unreadCount > 0 && (
                          <Badge
                            badgeContent={unreadCount}
                            color="primary"
                            sx={{ ml: 1 }}
                          />
                        )}
                      </Box>
                    }
                    secondary={
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        noWrap
                        sx={{ fontWeight: unreadCount > 0 ? 'medium' : 'normal' }}
                      >
                        {conversation
                          ? formatLastMessage(conversation)
                          : user.status === 'online'
                            ? 'Online'
                            : `Hoạt động ${formatLastActive(user.lastActive)}`
                        }
                      </Typography>
                    }
                  />
                </ListItemButton>
              );
            })}
          </List>
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body2" color="text.secondary">
              Không tìm thấy {userTypeLabel.toLowerCase()} phù hợp
            </Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default StudentList;