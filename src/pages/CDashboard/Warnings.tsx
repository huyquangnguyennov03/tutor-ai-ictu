import React from 'react';
import {
  Box,
  Typography,
  Button
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store'; // Import AppDispatch type
import {
  selectWarnings,
  selectTopStudents,
  selectAssignments,
  sendReminder
} from '@/redux/slices/teacherDashboardSlice';

const Warnings = () => {
  // Get data from Redux store instead of using mock data
  const studentWarnings = useSelector(selectWarnings);
  const topStudents = useSelector(selectTopStudents);
  const assignments = useSelector(selectAssignments);
  const dispatch = useDispatch<AppDispatch>(); // Use typed dispatch

  // Get the upcoming assignment with nearest deadline
  const upcomingAssignment = assignments.find(a => a.status === 'sắp hết hạn') ||
    (assignments.length > 0 ? assignments[0] : null);

  // Functions to handle button clicks (connected with Redux actions)
  const handleViewDetails = (mssv: string): void => {
    console.log(`Viewing details for student ${mssv}`);
    // Could dispatch a Redux action here if you add one for this functionality
  };

  const handleContactStudent = (mssv: string, priority: 'khẩn cấp' | 'cảnh báo' | 'thông tin'): void => {
    console.log(`Contacting student ${mssv} with ${priority} priority`);
    // Could dispatch a Redux action here if you add one for this functionality
  };

  const handleViewAllAtRisk = (): void => {
    console.log('Viewing all at-risk students');
    // Could dispatch a Redux action here if you add one for this functionality
  };

  const handleSendReminder = (): void => {
    if (upcomingAssignment) {
      dispatch(sendReminder(upcomingAssignment.name));
    }
  };

  const handleViewAllTopStudents = (): void => {
    console.log('Viewing all top students');
    // Could dispatch a Redux action here if you add one for this functionality
  };

  // Handle the case when there are no warnings yet
  if (studentWarnings.length === 0) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
          Cảnh báo & Nhắc nhở
        </Typography>
        <Typography>Không có cảnh báo nào.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
        Cảnh báo & Nhắc nhở
      </Typography>

      {/* Students needing assistance */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
          Sinh viên cần hỗ trợ
        </Typography>

        {/* Urgent warnings - high priority students */}
        {studentWarnings.filter(warning => warning.priority === 'khẩn cấp').map((warning) => (
          <Box key={warning.mssv} sx={{
            mb: 2,
            p: 3,
            borderRadius: '8px',
            backgroundColor: '#ffebee',
            borderLeft: '4px solid #f44336',
            position: 'relative'
          }}>
            <Box sx={{
              position: 'absolute',
              top: 10,
              right: 10,
              backgroundColor: '#f44336',
              color: 'white',
              borderRadius: '20px',
              px: 2,
              py: 0.5,
              fontSize: '0.75rem',
              fontWeight: 'bold'
            }}>
              Khẩn cấp
            </Box>

            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
              {warning.name} ({warning.mssv}) - Nguy cơ trượt môn
            </Typography>

            <Typography variant="body1" sx={{ mb: 0.5 }}>
              Điểm trung bình: {warning.score}/10
            </Typography>

            <Typography variant="body1" sx={{ mb: 0.5 }}>
              Tiến độ hoàn thành: {warning.progress}%
            </Typography>

            <Typography variant="body1" sx={{ mb: 2 }}>
              Vấn đề: {warning.issue.split('Vấn đề: ')[1] || warning.issue}
            </Typography>

            <Box>
              <Button
                variant="contained"
                sx={{
                  mr: 1,
                  backgroundColor: '#5c8ed0',
                  '&:hover': { backgroundColor: '#4577bb' },
                  borderRadius: '4px'
                }}
                onClick={() => handleViewDetails(warning.mssv)}
              >
                Xem chi tiết
              </Button>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#ff9800',
                  '&:hover': { backgroundColor: '#ed8c00' },
                  borderRadius: '4px'
                }}
                onClick={() => handleContactStudent(warning.mssv, 'khẩn cấp')}
              >
                Liên hệ ngay
              </Button>
            </Box>
          </Box>
        ))}

        {/* Warning - medium priority students */}
        {studentWarnings.filter(warning => warning.priority === 'cảnh báo').map((warning) => (
          <Box key={warning.mssv} sx={{
            mb: 2,
            p: 3,
            borderRadius: '8px',
            backgroundColor: '#fff8e1',
            borderLeft: '4px solid #ffb300',
            position: 'relative'
          }}>
            <Box sx={{
              position: 'absolute',
              top: 10,
              right: 10,
              backgroundColor: '#ff9800',
              color: 'white',
              borderRadius: '20px',
              px: 2,
              py: 0.5,
              fontSize: '0.75rem',
              fontWeight: 'bold'
            }}>
              Cần chú ý
            </Box>

            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
              {warning.name} ({warning.mssv}) - Tiến độ chậm
            </Typography>

            <Typography variant="body1" sx={{ mb: 0.5 }}>
              Điểm trung bình: {warning.score}/10
            </Typography>

            <Typography variant="body1" sx={{ mb: 0.5 }}>
              Tiến độ hoàn thành: {warning.progress}%
            </Typography>

            <Typography variant="body1" sx={{ mb: 2 }}>
              Vấn đề: {warning.issue.split('Vấn đề: ')[1] || warning.issue}
            </Typography>

            <Box>
              <Button
                variant="contained"
                sx={{
                  mr: 1,
                  backgroundColor: '#5c8ed0',
                  '&:hover': { backgroundColor: '#4577bb' },
                  borderRadius: '4px'
                }}
                onClick={() => handleViewDetails(warning.mssv)}
              >
                Xem chi tiết
              </Button>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#5c8ed0',
                  '&:hover': { backgroundColor: '#4577bb' },
                  borderRadius: '4px'
                }}
                onClick={() => handleContactStudent(warning.mssv, 'cảnh báo')}
              >
                Liên hệ
              </Button>
            </Box>
          </Box>
        ))}

        {/* Info - more students need assistance (if there are more than what we're showing) */}
        {studentWarnings.filter(warning => warning.priority === 'thông tin').length > 0 && (
          <Box sx={{
            mb: 2,
            p: 3,
            borderRadius: '8px',
            backgroundColor: '#e8f5e9',
            borderLeft: '4px solid #43a047',
            position: 'relative'
          }}>
            <Box sx={{
              position: 'absolute',
              top: 10,
              right: 10,
              backgroundColor: '#5c8ed0',
              color: 'white',
              borderRadius: '20px',
              px: 2,
              py: 0.5,
              fontSize: '0.75rem',
              fontWeight: 'bold'
            }}>
              Thông tin
            </Box>

            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
              {studentWarnings.filter(warning => warning.priority === 'thông tin').length} sinh viên khác cần hỗ trợ
            </Typography>

            <Typography variant="body1" sx={{ mb: 2 }}>
              Các sinh viên có điểm dưới mức trung bình hoặc tiến độ chậm
            </Typography>

            <Button
              variant="contained"
              sx={{
                backgroundColor: '#5c8ed0',
                '&:hover': { backgroundColor: '#4577bb' },
                borderRadius: '4px'
              }}
              onClick={handleViewAllAtRisk}
            >
              Xem tất cả
            </Button>
          </Box>
        )}
      </Box>

      {/* Deadline warnings */}
      {upcomingAssignment && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
            Cảnh báo về deadline
          </Typography>

          <Box sx={{
            mb: 2,
            p: 3,
            borderRadius: '8px',
            backgroundColor: '#fff8e1',
            borderLeft: '4px solid #ffb300',
            position: 'relative'
          }}>
            <Box sx={{
              position: 'absolute',
              top: 10,
              right: 10,
              backgroundColor: '#ff9800',
              color: 'white',
              borderRadius: '20px',
              px: 2,
              py: 0.5,
              fontSize: '0.75rem',
              fontWeight: 'bold'
            }}>
              Sắp hết hạn
            </Box>

            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
              {upcomingAssignment.name}: Đang chờ nộp bài
            </Typography>

            <Typography variant="body1" sx={{ mb: 0.5 }}>
              Deadline: {upcomingAssignment.deadline}
            </Typography>

            <Typography variant="body1" sx={{ mb: 0.5 }}>
              Đã nộp: {upcomingAssignment.submitted} sinh viên ({upcomingAssignment.completionRate}%)
            </Typography>

            <Typography variant="body1" sx={{ mb: 2 }}>
              {parseInt(upcomingAssignment.submitted.split('/')[1]) - parseInt(upcomingAssignment.submitted.split('/')[0])} sinh viên chưa nộp bài tập này
            </Typography>

            <Box>
              <Button
                variant="contained"
                sx={{
                  mr: 1,
                  backgroundColor: '#5c8ed0',
                  '&:hover': { backgroundColor: '#4577bb' },
                  borderRadius: '4px'
                }}
                onClick={() => handleViewDetails('assignment-' + upcomingAssignment.name)}
              >
                Xem chi tiết
              </Button>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#ff9800',
                  '&:hover': { backgroundColor: '#ed8c00' },
                  borderRadius: '4px'
                }}
                onClick={handleSendReminder}
              >
                Gửi nhắc nhở
              </Button>
            </Box>
          </Box>
        </Box>
      )}

      {/* Top performing students */}
      {topStudents.length > 0 && (
        <Box>
          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
            Sinh viên xuất sắc
          </Typography>

          <Box sx={{
            mb: 2,
            p: 3,
            borderRadius: '8px',
            backgroundColor: '#e8f5e9',
            borderLeft: '4px solid #43a047',
            position: 'relative'
          }}>
            <Box sx={{
              position: 'absolute',
              top: 10,
              right: 10,
              backgroundColor: '#4caf50',
              color: 'white',
              borderRadius: '20px',
              px: 2,
              py: 0.5,
              fontSize: '0.75rem',
              fontWeight: 'bold'
            }}>
              Xuất sắc
            </Box>

            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
              {topStudents.length} sinh viên có thành tích tốt nhất
            </Typography>

            {topStudents.map((student, index) => (
              <Typography key={student.mssv} variant="body1" sx={{ mb: 0.5 }}>
                {index + 1}. {student.name} ({student.mssv}) - Điểm TB: {student.score}, Tiến độ: {student.progress}%
              </Typography>
            ))}

            <Box sx={{ mt: 2 }}>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#5c8ed0',
                  '&:hover': { backgroundColor: '#4577bb' },
                  borderRadius: '4px'
                }}
                onClick={handleViewAllTopStudents}
              >
                Xem tất cả
              </Button>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Warnings;