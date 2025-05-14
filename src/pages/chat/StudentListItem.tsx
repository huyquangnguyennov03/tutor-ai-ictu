import React from 'react';
import {
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  Box,
  Avatar,
  Badge,
  Chip
} from '@mui/material';
import { Student } from './types';

interface StudentListItemProps {
  student: Student;
  selected: boolean;
  onClick: () => void;
}

const StudentListItem: React.FC<StudentListItemProps> = ({ student, selected, onClick }) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <ListItem
      disablePadding
      sx={{
        mb: 1,
        overflow: 'hidden',
        position: 'relative',
        '&::after': selected ? {
          content: '""',
          position: 'absolute',
          left: 0,
          top: 0,
          height: '100%',
          width: '4px',
          backgroundColor: 'primary.dark'
        } : {}
      }}
    >
      <Box
        onClick={onClick}
        sx={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          px: 2,
          py: 1.5,
          borderRadius: 2,
          cursor: 'pointer',
          bgcolor: selected ? 'primary.main' : 'background.paper',
          color: selected ? 'white' : 'inherit',
          transition: 'all 0.2s ease',
          '&:hover': {
            bgcolor: selected ? 'primary.light' : 'rgba(0, 0, 0, 0.04)',
            transform: 'translateY(-2px)',
            boxShadow: selected ? 3 : 1
          },
          boxShadow: selected ? 2 : 0,
          height: 72,
        }}
      >
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          badgeContent={
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                bgcolor: student.status === 'online' ? '#4caf50' : '#bdbdbd',
                border: '2px solid white'
              }}
            />
          }
        >
          <Avatar
            sx={{
              bgcolor: selected ? 'primary.dark' : 'primary.light',
              color: 'white',
              mr: 2,
              width: 40,
              height: 40
            }}
          >
            {getInitials(student.name)}
          </Avatar>
        </Badge>

        <ListItemText
          primary={
            <Typography
              variant="subtitle1"
              fontWeight={selected ? 600 : 500}
              color={selected ? 'inherit' : 'text.primary'}
              noWrap
            >
              {student.name}
            </Typography>
          }
          secondary={
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
              <Typography
                variant="body2"
                color={selected ? 'rgba(255,255,255,0.7)' : 'text.secondary'}
                sx={{ mr: 1 }}
                noWrap
              >
                {student.id}
              </Typography>
              <Chip
                label={student.status === 'online' ? 'Online' : 'Offline'}
                size="small"
                color={student.status === 'online' ? 'success' : 'default'}
                variant={selected ? 'filled' : 'outlined'}
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
          }
        />
      </Box>
    </ListItem>
  );
};

export default StudentListItem;