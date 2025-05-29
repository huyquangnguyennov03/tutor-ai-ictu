import React, { useState } from "react"
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
  selectStudentsNeedingSupport,
  selectAssignments,
  sendReminder
} from '@/redux/slices/teacherDashboardSlice';
import TopStudentsDialog from './TopStudentsDialog';
import StudentSubmissionDialog from './StudentSubmissionDialog';

const Warnings = () => {
  // Get data from Redux store instead of using mock data
  const studentWarnings = useSelector(selectWarnings);
  const topStudents = useSelector(selectTopStudents);
  const studentsNeedingSupport = useSelector(selectStudentsNeedingSupport);
  const assignments = useSelector(selectAssignments);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isSubmissionDialogOpen, setSubmissionDialogOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>(); // Use typed dispatch

  // Get the upcoming assignment with nearest deadline
  const upcomingAssignment = assignments.find(a => a.status === 'sắp hết hạn') ||
    (assignments.length > 0 ? assignments[0] : null);

  // Functions to handle button clicks (connected with Redux actions)
  const handleViewDetails = (mssv: string): void => {
    if (mssv.startsWith('assignment-')) {
      setSubmissionDialogOpen(true);
    } else {
      console.log(`Viewing details for student ${mssv}`);
      // Hoặc xử lý riêng nếu cần
    }
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
    setDialogOpen(true);
  };

  // Handle the case when there are no warnings yet and no students needing support
  if (studentsNeedingSupport.length === 0 && !upcomingAssignment && topStudents.length === 0) {
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

      {/* Students needing assistance - Students with score < 2 */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
          Sinh viên cần hỗ trợ
        </Typography>

        {studentsNeedingSupport.length > 0 ? (
          studentsNeedingSupport.map((student) => (
            <Box key={student.mssv} sx={{
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
                {student.name} ({student.mssv}) - Điểm dưới 2.0
              </Typography>

              <Typography variant="body1" sx={{ mb: 0.5 }}>
                Điểm trung bình: {student.score}/10
              </Typography>

              <Typography variant="body1" sx={{ mb: 0.5 }}>
                Tiến độ hoàn thành: {student.progress}%
              </Typography>

              <Typography variant="body1" sx={{ mb: 2 }}>
                Vấn đề: {student.issue}
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
                  onClick={() => handleViewDetails(student.mssv)}
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
                  onClick={() => handleContactStudent(student.mssv, 'khẩn cấp')}
                >
                  Liên hệ ngay
                </Button>
              </Box>
            </Box>
          ))
        ) : (
          <Typography variant="body1">Không có sinh viên nào có điểm dưới 2.0</Typography>
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
          <StudentSubmissionDialog
            open={isSubmissionDialogOpen}
            onClose={() => setSubmissionDialogOpen(false)}
            assignmentName={upcomingAssignment.name}
          />
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

      <TopStudentsDialog
        open={isDialogOpen}
        onClose={() => setDialogOpen(false)}
        students={topStudents}
      />
    </Box>
  );
};

export default Warnings;