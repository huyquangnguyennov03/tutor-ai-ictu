// src/pages/assignment/AssignmentManagement.tsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import {
  fetchAssignments,
  selectAllAssignments,
  selectCompletedAssignments,
  selectActiveTab,
  setActiveTab,
  selectStatus,
  selectError
} from '@/redux/slices/assignmentManagementSlice';
import { Container, Box, Typography, Tabs, Tab, Paper, CircularProgress, Alert } from '@mui/material';
import AssignmentList from './AssignmentList';
import AssignmentDetail from './AssignmentDetail';
import CompletedAssignmentsTable from './CompletedAssignmentsTable';

const AssignmentManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const currentAssignments = useSelector(selectAllAssignments);
  const completedAssignments = useSelector(selectCompletedAssignments);
  const activeTab = useSelector(selectActiveTab);
  const status = useSelector(selectStatus);
  const error = useSelector(selectError);

  useEffect(() => {
    // Fetch assignments on component mount
    dispatch(fetchAssignments());
  }, [dispatch]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: 'current' | 'completed') => {
    dispatch(setActiveTab(newValue));
  };

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" component="h1" fontWeight="bold" sx={{ mt: 2, mb: 3 }}>
        Quản lý Bài tập
      </Typography>

      <Paper elevation={0} sx={{ backgroundColor: '#f5f5f5', p: 1, mb: 2 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Bài tập hiện tại" value="current" />
          <Tab label="Bài tập đã hoàn thành" value="completed" />
        </Tabs>
      </Paper>

      {status === 'loading' && (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      )}

      {status === 'failed' && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || 'Có lỗi xảy ra khi tải dữ liệu bài tập'}
        </Alert>
      )}

      {status === 'succeeded' && (
        <>
          {activeTab === 'current' ? (
            <Box display="flex" sx={{ flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
              <Box sx={{ width: { xs: '100%', md: '30%' } }}>
                <AssignmentList assignments={currentAssignments} activeTab={activeTab} />
              </Box>
              <Box sx={{ width: { xs: '100%', md: '70%' } }}>
                <AssignmentDetail />
              </Box>
            </Box>
          ) : (
            <CompletedAssignmentsTable assignments={completedAssignments} />
          )}
        </>
      )}
    </Container>
  );
};

export default AssignmentManagement;