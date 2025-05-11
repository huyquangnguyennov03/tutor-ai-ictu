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
  Paper
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import PersonIcon from '@mui/icons-material/Person';
import CircleIcon from '@mui/icons-material/Circle';
import StudentListItem from './StudentListItem';
import { Student } from './types';

interface StudentListProps {
  students: Student[];
  selectedStudentId: string | null;
  onSelectStudent: (student: Student) => void;
}

const StudentList: React.FC<StudentListProps> = ({
                                                   students,
                                                   selectedStudentId,
                                                   onSelectStudent
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

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  let displayedStudents = [...filteredStudents];

  // Apply filters
  if (filter === 'online') {
    displayedStudents = displayedStudents.filter(
      (student) => student.status === 'online'
    );
  } else if (filter === 'offline') {
    displayedStudents = displayedStudents.filter(
      (student) => student.status === 'offline'
    );
  }

  const onlineCount = students.filter(
    (student) => student.status === 'online'
  ).length;

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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Sinh viên
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
              {students.length} sinh viên
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
          placeholder="Tìm kiếm sinh viên..."
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
          p: 2,
          bgcolor: 'background.default'
        }}
      >
        {displayedStudents.length > 0 ? (
          <List disablePadding>
            {displayedStudents.map((student) => (
              <StudentListItem
                key={student.id}
                student={student}
                selected={student.id === selectedStudentId}
                onClick={() => onSelectStudent(student)}
              />
            ))}
          </List>
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body2" color="text.secondary">
              Không tìm thấy sinh viên phù hợp
            </Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default StudentList;