// src/pages/assignment/AssignmentList.tsx
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import {
  Assignment,
  selectAssignment,
  fetchAssignmentDetail,
  selectSelectedAssignment
} from '@/redux/slices/assignmentManagementSlice';
import {
  Box,
  Paper,
  Typography,
  Chip,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button
} from '@mui/material';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';

interface AssignmentListProps {
  assignments: Assignment[];
  activeTab: 'current' | 'completed';
}

const AssignmentList: React.FC<AssignmentListProps> = ({ assignments, activeTab }) => {
  const dispatch = useDispatch<AppDispatch>();
  const selectedAssignment = useSelector(selectSelectedAssignment);

  const handleSelectAssignment = (assignmentId: string) => {
    dispatch(selectAssignment(assignmentId));

    // Only fetch details if there is no selected assignment or it's a different assignment
    if (!selectedAssignment || selectedAssignment.id !== assignmentId) {
      dispatch(fetchAssignmentDetail(assignmentId));
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: vi });
    } catch (error) {
      return dateString;
    }
  };

  if (assignments.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
        <Typography variant="body1" color="text.secondary">
          Không có bài tập nào {activeTab === 'current' ? 'cần hoàn thành' : 'đã hoàn thành'}
        </Typography>
      </Paper>
    );
  }

  // For completed assignments, show as a table
  if (activeTab === 'completed') {
    return (
      <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tên bài tập</TableCell>
              <TableCell>Chương</TableCell>
              <TableCell>Ngày nộp</TableCell>
              <TableCell>Điểm</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {assignments.map((assignment) => (
              <TableRow
                key={assignment.id}
                hover
                selected={selectedAssignment?.id === assignment.id}
                onClick={() => handleSelectAssignment(assignment.id)}
                sx={{
                  cursor: 'pointer',
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(25, 118, 210, 0.08)',
                  }
                }}
              >
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <DescriptionOutlinedIcon color="action" fontSize="small" sx={{ mr: 1 }} />
                    {assignment.title}
                  </Box>
                </TableCell>
                <TableCell>{assignment.chapter}</TableCell>
                <TableCell>{formatDate(assignment.deadline)}</TableCell>
                <TableCell>
                  <Chip
                    label={`${assignment.score || 0}/10`}
                    size="small"
                    color="success"
                    sx={{ fontWeight: 'bold' }}
                  />
                </TableCell>
                <TableCell>
                  <Button size="small" onClick={(e) => {
                    e.stopPropagation();
                    handleSelectAssignment(assignment.id);
                  }}>
                    Xem chi tiết
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  // For current assignments, show as a list with gaps between items like in Image 1
  return (
    <Box
      sx={{
        maxHeight: '400px',
        overflow: 'auto',
        p: 0
      }}
    >
      {assignments.map((assignment, index) => (
        <Paper
          key={assignment.id}
          elevation={1}
          sx={{
            borderRadius: 2,
            mb: 2,
            overflow: 'hidden',
            border: selectedAssignment?.id === assignment.id ? '1px solid rgba(25, 118, 210, 0.5)' : '1px solid transparent',
            borderLeft: selectedAssignment?.id === assignment.id ? '4px solid #1976d2' : '1px solid transparent'
          }}
        >
          <ListItemButton
            onClick={() => handleSelectAssignment(assignment.id)}
            selected={selectedAssignment?.id === assignment.id}
            sx={{
              p: 2,
              '&.Mui-selected': {
                backgroundColor: 'rgba(25, 118, 210, 0.08)',
              }
            }}
          >
            <Box width="100%">
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Box display="flex" alignItems="center">
                  <DescriptionOutlinedIcon color="action" sx={{ mr: 1 }} />
                  <Typography variant="subtitle1" fontWeight="bold">
                    {assignment.title}
                  </Typography>
                </Box>
              </Box>

              <Typography variant="body2" color="text.secondary" mb={1}>
                {assignment.course} - {assignment.chapter}
              </Typography>

              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" color="text.secondary">
                  Hạn nộp: {formatDate(assignment.deadline)}
                </Typography>

                <Chip
                  label="Đang chờ"
                  size="small"
                  sx={{
                    backgroundColor: 'white',
                    border: '1px solid #ccc',
                    color: 'text.secondary'
                  }}
                />
              </Box>
            </Box>
          </ListItemButton>
        </Paper>
      ))}
    </Box>
  );
};

export default AssignmentList;