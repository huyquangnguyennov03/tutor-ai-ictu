import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Divider,
  Chip,
  LinearProgress,
  Tooltip,
  IconButton,
  Stack,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar
} from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PersonIcon from '@mui/icons-material/Person';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import TimerIcon from '@mui/icons-material/Timer';
import InfoIcon from '@mui/icons-material/Info';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import MemoryIcon from '@mui/icons-material/Memory';
import CloseIcon from '@mui/icons-material/Close';
import NotificationsIcon from '@mui/icons-material/Notifications';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EmailIcon from '@mui/icons-material/Email';
import SchoolIcon from '@mui/icons-material/School';
import { User, StudentProgress } from './types';
import { Roles } from '../../common/constants/roles';
import { generateDashboardData } from '@/mockData/classDashboardData';

interface StudentProfileProps {
  user: User | null;
  progress: StudentProgress;
  currentUserRole: Roles;
  currentClass?: string;
}

const StudentProfile: React.FC<StudentProfileProps> = ({ user, progress, currentUserRole, currentClass = 'C Programming - C01' }) => {
  const [reminderOpen, setReminderOpen] = React.useState(false);

  const handleOpenReminder = () => {
    setReminderOpen(true);
  };

  const handleCloseReminder = () => {
    setReminderOpen(false);
  };

  if (!user) {
    return (
      <Paper
        elevation={0}
        sx={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3,
          borderRadius: 2,
          border: '1px solid rgba(0, 0, 0, 0.08)',
        }}
      >
        <Typography variant="body1" color="text.secondary" align="center">
          Chọn một {currentUserRole === Roles.TEACHER ? 'sinh viên' : 'giáo viên'} để xem thông tin
        </Typography>
      </Paper>
    );
  }

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
      {/* Header - Profile Section */}
      <Box
        sx={{
          p: 1,
          bgcolor: 'primary.main',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center'
        }}
      >
        <Avatar
          src={user.avatar}
          alt={user.name}
          sx={{ width: 100, height: 100, border: '4px solid white' }}
        >
          {user.name.charAt(0)}
        </Avatar>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          {user.name}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {user.role === Roles.STUDENT ? 'Sinh viên' : 'Giáo viên'}
        </Typography>
        <Chip
          label={user.status === 'online' ? 'Online' : user.status === 'away' ? 'Đang chờ' : 'Offline'}
          size="small"
          color={user.status === 'online' ? 'success' : user.status === 'away' ? 'warning' : 'default'}
        />
      </Box>

      {/* Container có thể cuộn cho tất cả nội dung bên dưới */}
      <Box
        sx={{
          overflow: 'auto',
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* User Info */}
        <Box sx={{ p: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.08)' }}>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Thông tin liên hệ
          </Typography>

          <List dense disablePadding>
            <ListItem disablePadding sx={{ py: 1 }}>
              <ListItemIcon sx={{ minWidth: 40 }}>
                <PersonIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="ID"
                secondary={user.id}
              />
            </ListItem>

            <ListItem disablePadding sx={{ py: 1 }}>
              <ListItemIcon sx={{ minWidth: 40 }}>
                <EmailIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Email"
                secondary={user.email || `${user.id}@student.edu.vn`}
              />
            </ListItem>

            {user.role === Roles.STUDENT && (
              <ListItem disablePadding sx={{ py: 1 }}>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <SchoolIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Lớp"
                  secondary={currentClass}
                />
              </ListItem>
            )}
          </List>
        </Box>

        {/* Only show student-specific sections for students */}
        {user.role === Roles.STUDENT && (
          <>
            {/* Progress Section */}
            <Box sx={{ p: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.08)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <EqualizerIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="subtitle1" fontWeight={600}>
                  Tiến độ học tập
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2" color="text.secondary">
                    Tổng tiến độ khóa học
                  </Typography>
                  <Typography variant="body1" fontWeight={600} color="primary.main">
                    {progress.completionPercentage}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={progress.completionPercentage}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: 'rgba(0, 0, 0, 0.08)',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 4
                    }
                  }}
                />
              </Box>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Điểm hiện tại
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
                    <Typography variant="h6" fontWeight={600} color="primary.main">
                      {progress.currentScore}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                      /{progress.totalScore}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Chương hiện tại
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
                    <Typography variant="h6" fontWeight={600} color="primary.main">
                      {progress.currentChapter}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                      /{progress.totalChapters}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Box sx={{ mt: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Chủ đề hiện tại
                </Typography>
                <Chip
                  label="Mảng & Chuỗi"
                  variant="outlined"
                  color="primary"
                  size="small"
                  sx={{ mt: 0.5 }}
                />
              </Box>
            </Box>

            {/* Deadline Section */}
            <Box sx={{
              p: 2,
              borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
              bgcolor: 'background.default'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AssignmentIcon color="error" sx={{ mr: 1 }} />
                <Typography variant="subtitle1" fontWeight={600}>
                  Deadline sắp tới
                </Typography>
              </Box>

              <Stack spacing={2}>
                <Box sx={{
                  bgcolor: 'background.paper',
                  borderRadius: 2,
                  p: 1.5,
                  border: '1px solid rgba(0, 0, 0, 0.08)'
                }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Typography variant="subtitle2" fontWeight={600}>
                      Lab 4: Mảng và con trỏ
                    </Typography>
                    <Chip
                      label="Chưa nộp"
                      color="warning"
                      size="small"
                      sx={{
                        height: 20,
                        '& .MuiChip-label': {
                          px: 1,
                          fontSize: '0.625rem',
                          fontWeight: 500
                        }
                      }}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <TimerIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                    <Typography variant="caption" color="text.secondary">
                      Hạn nộp: 24/07/2024
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{
                  bgcolor: 'background.paper',
                  borderRadius: 2,
                  p: 1.5,
                  border: '1px solid rgba(0, 0, 0, 0.08)'
                }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Typography variant="subtitle2" fontWeight={600}>
                      Bài tập: Quản lý bộ nhớ
                    </Typography>
                    <Chip
                      label="Đã nộp"
                      color="success"
                      size="small"
                      sx={{
                        height: 20,
                        '& .MuiChip-label': {
                          px: 1,
                          fontSize: '0.625rem',
                          fontWeight: 500
                        }
                      }}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <TimerIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                    <Typography variant="caption" color="text.secondary">
                      Đã nộp: 20/07/2024
                    </Typography>
                  </Box>
                </Box>
              </Stack>
            </Box>

            {/* Common Errors Section */}
            <Box sx={{
              p: 2,
              borderBottom: '1px solid rgba(0, 0, 0, 0.08)'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ErrorOutlineIcon color="error" sx={{ mr: 1 }} />
                <Typography variant="subtitle1" fontWeight={600}>
                  Lỗi phổ biến
                </Typography>
              </Box>

              <List disablePadding sx={{ mb: 1 }}>
                <ListItem dense disableGutters>
                  <ListItemIcon sx={{ minWidth: '28px' }}>
                    <Typography variant="body2" fontWeight={500}>1.</Typography>
                  </ListItemIcon>
                  <ListItemText
                    primary="array index out of bounds (5 lần)"
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItem>

                <ListItem dense disableGutters>
                  <ListItemIcon sx={{ minWidth: '28px' }}>
                    <Typography variant="body2" fontWeight={500}>2.</Typography>
                  </ListItemIcon>
                  <ListItemText
                    primary="null pointer dereference (3 lần)"
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItem>

                <ListItem dense disableGutters>
                  <ListItemIcon sx={{ minWidth: '28px' }}>
                    <Typography variant="body2" fontWeight={500}>3.</Typography>
                  </ListItemIcon>
                  <ListItemText
                    primary="memory leak (2 lần)"
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItem>
              </List>
            </Box>

            {/* Actions Section - Only for teachers viewing students */}
            {currentUserRole === Roles.TEACHER && (
              <Box sx={{
                p: 2,
                flex: '1 0 auto'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <InfoIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="subtitle1" fontWeight={600}>
                    Hành động
                  </Typography>
                </Box>

                <Stack spacing={2} direction="column">
                  <Button
                    variant="contained"
                    startIcon={<VisibilityIcon />}
                    size="medium"
                    fullWidth
                    sx={{ textTransform: 'none', borderRadius: 2 }}
                  >
                    Xem tiến độ chi tiết
                  </Button>

                  <Button
                    variant="contained"
                    startIcon={<NotificationsIcon />}
                    color="warning"
                    size="medium"
                    fullWidth
                    sx={{ textTransform: 'none', borderRadius: 2 }}
                    onClick={handleOpenReminder}
                  >
                    Gửi nhắc nhở
                  </Button>
                </Stack>
              </Box>
            )}
          </>
        )}

        {/* Teacher-specific information */}
        {user.role === Roles.TEACHER && (
          <Box sx={{ p: 2 }}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Thông tin giảng dạy
            </Typography>

            <List dense disablePadding>
              <ListItem disablePadding sx={{ py: 1 }}>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <SchoolIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Khoa"
                  secondary="Khoa học máy tính"
                />
              </ListItem>

              <ListItem disablePadding sx={{ py: 1 }}>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <AssignmentIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Môn học đang dạy"
                  secondary="3 môn học đang hoạt động"
                />
              </ListItem>

              <ListItem disablePadding sx={{ py: 1 }}>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <TimerIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Giờ làm việc"
                  secondary="Thứ 2, Thứ 4: 10:00 - 12:00"
                />
              </ListItem>
            </List>
          </Box>
        )}
      </Box>

      {/* Reminder Dialog */}
      <Dialog
        open={reminderOpen}
        onClose={handleCloseReminder}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Gửi nhắc nhở</Typography>
            <IconButton size="small" onClick={handleCloseReminder}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ pt: 2 }}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              Sinh viên: {user.name}
            </Typography>
            <Typography variant="body2">
              MSSV: {user.id}
            </Typography>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Loại nhắc nhở:
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                defaultValue="deadline"
                variant="outlined"
              >
                <MenuItem value="deadline">Deadline sắp đến</MenuItem>
                <MenuItem value="exam">Lịch thi</MenuItem>
                <MenuItem value="absence">Vắng mặt</MenuItem>
                <MenuItem value="other">Khác</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Nội dung:
            </Typography>
            <TextField
              multiline
              rows={6}
              fullWidth
              variant="outlined"
              size="small"
              defaultValue="Giáo viên nhận thấy bạn đang có nguy cơ bỏ lỡ deadline nộp bài tập Lab 4 vào 24/07/2024. Vui lòng hoàn thành và nộp bài tập trước thời hạn.

Nếu gặp khó khăn, bạn có thể sử dụng AI Tutor để được hỗ trợ hoặc liên hệ trực tiếp với giáo viên.

Trân trọng,
TS. Nguyễn Văn X"
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={handleCloseReminder}
            variant="outlined"
            sx={{ borderRadius: 2, textTransform: 'none' }}
          >
            Hủy
          </Button>
          <Button
            onClick={handleCloseReminder}
            variant="contained"
            color="primary"
            sx={{ borderRadius: 2, textTransform: 'none' }}
          >
            Gửi nhắc nhở
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default StudentProfile;