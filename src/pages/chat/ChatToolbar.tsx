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
  Box,
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ClassIcon from '@mui/icons-material/Class';
import CloseIcon from '@mui/icons-material/Close';

interface ChatToolbarProps {
  currentClass: string;
  onClassChange: (className: string) => void;
}

const ChatToolbar: React.FC<ChatToolbarProps> = ({ currentClass, onClassChange }) => {
  const [open, setOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<string>(currentClass);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

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
            Giao diện Tương tác Giáo viên - Sinh viên
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<ClassIcon />}
            onClick={handleClickOpen}
            sx={{ mr: 2, boxShadow: 2 }}
          >
            Chọn lớp
          </Button>
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<DashboardIcon />}
            href="/trang-chu"
            sx={{ fontWeight: 500, borderColor: 'rgba(255,255,255,0.5)' }}
          >
            Quay lại Dashboard
          </Button>
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
          {/* Tăng padding-top để tạo thêm không gian cho label */}
          <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
            <InputLabel
              id="class-select-label"
              sx={{
                backgroundColor: 'white',
                px: 1,
                // Đảm bảo label hiển thị đúng
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
                height: '56px', // Tăng chiều cao của Select
                '& .MuiSelect-select': {
                  pt: 2 // Tăng padding-top cho nội dung select
                }
              }}
            >
              <MenuItem value="C Programming - C01">C Programming - C01</MenuItem>
              <MenuItem value="Java Programming - J01">Java Programming - J01</MenuItem>
              <MenuItem value="Python - P01">Python - P01</MenuItem>
              <MenuItem value="Web Development - W01">Web Development - W01</MenuItem>
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