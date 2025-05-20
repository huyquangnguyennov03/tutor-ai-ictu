import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  IconButton,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  Avatar,
  useMediaQuery,
  useTheme,
  Tooltip,
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ClassIcon from '@mui/icons-material/Class';
import CloseIcon from '@mui/icons-material/Close';
import { Roles } from '@/common/constants/roles';
import { courseOptions } from '@/mockData/classDashboardData';

interface ChatToolbarProps {
  currentClass: string;
  onClassChange: (className: string) => void;
  currentUserRole?: Roles;
  unreadNotifications?: number;
  userAvatar?: string;
  userName?: string;
}

const ChatToolbar: React.FC<ChatToolbarProps> = ({
                                                   currentClass,
                                                   onClassChange,
                                                   currentUserRole = Roles.TEACHER,
                                                   unreadNotifications = 0,
                                                   userAvatar,
                                                   userName = 'Giáo viên'
                                                 }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [open, setOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<string>(currentClass);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleClassChange = (event: SelectChangeEvent) => {
    setSelectedClass(event.target.value);
  };

  const handleConfirm = () => {
    onClassChange(selectedClass);
    setOpen(false);
  };

  return (
    <>
      <AppBar position="static" color="primary" elevation={0}>
        <Toolbar>
          <SchoolIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            {isMobile ? 'Chat' : 'Giao diện Tương tác Giáo viên - Sinh viên'}
          </Typography>

          {currentUserRole === Roles.TEACHER && (
            <>
              {/* Desktop button */}
              <Button
                variant="contained"
                color="secondary"
                startIcon={<ClassIcon />}
                onClick={handleClickOpen}
                sx={{ mr: 2, boxShadow: 2, display: { xs: 'none', sm: 'flex' } }}
              >
                Chọn lớp
              </Button>
              {/* Mobile icon button */}
              <Tooltip title="Chọn lớp">
                <IconButton
                  onClick={handleClickOpen}
                  color="inherit"
                  sx={{ display: { xs: 'flex', sm: 'none' } }}
                >
                  <ClassIcon />
                </IconButton>
              </Tooltip>
            </>
          )}

          <>
            {/* Desktop button */}
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<DashboardIcon />}
              href="/trang-chu"
              sx={{
                fontWeight: 500,
                borderColor: 'rgba(255,255,255,0.5)',
                display: { xs: 'none', sm: 'flex' }
              }}
            >
              Quay lại Dashboard
            </Button>
            {/* Mobile icon button */}
            <Tooltip title="Dashboard">
              <IconButton
                href="/trang-chu"
                color="inherit"
                sx={{ display: { xs: 'flex', sm: 'none' }, ml: 1 }}
              >
                <DashboardIcon />
              </IconButton>
            </Tooltip>
          </>

          {userAvatar && (
            <IconButton sx={{ ml: 1, p: 0 }}>
              <Avatar
                src={userAvatar}
                alt={userName}
                sx={{ width: 36, height: 36, border: '2px solid white' }}
              >
                {userName.charAt(0)}
              </Avatar>
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* Class Selection Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: '400px',
            maxWidth: '100%',
            borderRadius: 2,
          }
        }}
      >
        <DialogTitle sx={{
          borderBottom: '1px solid #eee',
          pb: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: 'primary.main',
          fontWeight: 500
        }}>
          Chọn lớp
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              color: 'grey.500',
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 4, pb: 2 }}>
          <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
            <InputLabel
              id="class-select-label"
              sx={{
                backgroundColor: 'white',
                px: 1,
                '&.MuiInputLabel-shrink': {
                  transform: 'translate(14px, -9px) scale(0.75)'
                }
              }}
            >
              Lớp học:
            </InputLabel>
            <Select
              labelId="class-select-label"
              id="class-select"
              value={selectedClass}
              label="Lớp học:"
              onChange={handleClassChange}
              sx={{
                height: '56px',
                '& .MuiSelect-select': {
                  pt: 2
                }
              }}
            >
              {courseOptions.map((course) => (
                <MenuItem key={course.id} value={course.name}>
                  {course.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, pt: 2, justifyContent: 'space-between' }}>
          <Button
            onClick={handleClose}
            variant="outlined"
            sx={{ width: '100px' }}
          >
            Hủy
          </Button>
          <Button
            onClick={handleConfirm}
            variant="contained"
            color="primary"
            sx={{ width: '100px' }}
          >
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ChatToolbar;