// src/pages/assignment/CompletedAssignmentsTable.tsx
import React from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import {
  Assignment,
  fetchAssignmentDetail
} from '@/redux/slices/assignmentManagementSlice';
import {
  Box,
  Paper,
  Typography,
  Chip,
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
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

interface CompletedAssignmentsTableProps {
  assignments: Assignment[];
}

const CompletedAssignmentsTable: React.FC<CompletedAssignmentsTableProps> = ({ assignments }) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleViewAssignment = (assignmentId: string) => {
    // Here you could navigate to a details page or open a modal with assignment details
    dispatch(fetchAssignmentDetail(assignmentId));
    // Example if you want to navigate:
    // navigate(`/assignments/${assignmentId}`);
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
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          Không có bài tập nào đã hoàn thành
        </Typography>
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell width="30%">Tên bài tập</TableCell>
            <TableCell width="20%">Chương</TableCell>
            <TableCell width="15%">Ngày nộp</TableCell>
            <TableCell width="15%">Điểm</TableCell>
            <TableCell width="20%">Hành động</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {assignments.map((assignment) => (
            <TableRow
              key={assignment.id}
              hover
              sx={{ cursor: 'pointer' }}
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
                <Box display="flex" alignItems="center">
                  <CheckCircleOutlineIcon
                    color="success"
                    fontSize="small"
                    sx={{ mr: 0.5 }}
                  />
                  <Chip
                    label={`${assignment.score || 0}/10`}
                    size="small"
                    color="success"
                    sx={{ fontWeight: 'bold' }}
                  />
                </Box>
              </TableCell>
              <TableCell>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<VisibilityIcon />}
                  onClick={() => handleViewAssignment(assignment.id)}
                >
                  Xem chi tiết
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CompletedAssignmentsTable;