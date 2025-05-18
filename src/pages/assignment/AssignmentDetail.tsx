// src/pages/assignment/AssignmentDetail.tsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import {
  selectSelectedAssignment,
  selectStatus,
  submitAssignment,
  selectActiveTab,
  selectError,
  clearError
} from '@/redux/slices/assignmentManagementSlice';
import {
  Paper,
  Typography,
  Box,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
  Link
} from '@mui/material';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import AttachFileIcon from '@mui/icons-material/AttachFile';

const AssignmentDetail: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const selectedAssignment = useSelector(selectSelectedAssignment);
  const status = useSelector(selectStatus);
  const activeTab = useSelector(selectActiveTab);
  const error = useSelector(selectError);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [comment, setComment] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const isLoading = status === 'loading';
  const isCompleted = activeTab === 'completed' || selectedAssignment?.isCompleted;

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: vi });
    } catch (error) {
      return dateString;
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleSubmit = () => {
    if (!selectedAssignment || !selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);
    if (comment) {
      formData.append('comment', comment);
    }

    dispatch(submitAssignment({ id: selectedAssignment.id, formData }))
      .unwrap()
      .then(() => {
        setSubmitSuccess(true);
        setTimeout(() => setSubmitSuccess(false), 5000);
      })
      .catch(() => {
        // Error is handled in reducer
      });

    setOpenDialog(false);
    setSelectedFile(null);
    setComment('');
  };

  // Clear error when component unmounts or when assignment changes
  React.useEffect(() => {
    return () => {
      if (error) {
        dispatch(clearError());
      }
    };
  }, [dispatch, selectedAssignment]);

  if (!selectedAssignment) {
    return (
      <Paper sx={{ p: 3, height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: 2 }}>
        <Typography variant="body1" color="text.secondary">
          Chọn một bài tập để xem chi tiết
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 0, height: '100%', overflow: 'hidden', borderRadius: 2 }}>
      {isLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Header */}
          <Box sx={{ p: 3, borderBottom: '1px solid #eee' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h5" fontWeight="bold">
                {selectedAssignment.title || "Bài tập về Mảng và Con trỏ"}
              </Typography>
              <Chip
                label={selectedAssignment.chapter || "Mảng & Chuỗi"}
                size="small"
                sx={{ bgcolor: '#f0f0f0', fontWeight: 500 }}
              />
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Hạn nộp: {formatDate(selectedAssignment.deadline) || "28/07/2025"} • {selectedAssignment.course || "Lập Trình C"}
            </Typography>
          </Box>

          {/* Content */}
          <Box sx={{ p: 3 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }} onClose={() => dispatch(clearError())}>
                {error}
              </Alert>
            )}

            {submitSuccess && (
              <Alert severity="success" sx={{ mb: 2 }}>
                Bài tập đã được nộp thành công!
              </Alert>
            )}

            <Box mb={3}>
              <Typography variant="body1" fontWeight="bold" mb={1}>
                Mô tả:
              </Typography>
              <Typography variant="body1">
                {selectedAssignment.description ||
                  "Viết các hàm xử lý mảng một chiều và chuỗi. Sử dụng con trỏ để truy cập và thao tác với mảng."}
              </Typography>
            </Box>

            <Box
              mb={3}
              sx={{
                p: 2,
                bgcolor: '#f5f5f5',
                borderRadius: 1,
                border: '1px solid #eaeaea'
              }}
            >
              <Typography variant="body1" fontWeight="bold" mb={1}>
                Tài liệu:
              </Typography>
              <Box display="flex" alignItems="center">
                <InsertDriveFileOutlinedIcon color="primary" fontSize="small" />
                <Link
                  href={selectedAssignment.materials?.[0]?.url || "#"}
                  underline="hover"
                  sx={{ ml: 1, fontSize: '0.9rem' }}
                >
                  {selectedAssignment.materials?.[0]?.name || "baitap_vonglap.pdf"}
                </Link>
              </Box>
            </Box>

            <Box display="flex" mt={4}>
              <Box flexGrow={1} />

              <Button
                variant="outlined"
                sx={{ mr: 2, borderColor: '#ddd', color: '#333' }}
              >
                Xem hướng dẫn
              </Button>

              <Button
                variant="contained"
                color="primary"
                onClick={() => setOpenDialog(true)}
                startIcon={<CloudUploadIcon />}
              >
                Nộp bài
              </Button>
            </Box>
          </Box>

          {/* Submit Assignment Dialog */}
          <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
            <DialogTitle>Nộp bài tập</DialogTitle>
            <DialogContent>
              <Typography variant="subtitle1" gutterBottom>
                {selectedAssignment.title || "Bài tập về Mảng và Con trỏ"}
              </Typography>

              <Box sx={{ mt: 2, mb: 3 }}>
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<AttachFileIcon />}
                  sx={{ mb: 2 }}
                >
                  Chọn file
                  <input
                    type="file"
                    hidden
                    onChange={handleFileChange}
                  />
                </Button>

                {selectedFile && (
                  <Box sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
                    <InsertDriveFileOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      {selectedFile.name}
                    </Typography>
                  </Box>
                )}
              </Box>

              <TextField
                label="Ghi chú (tùy chọn)"
                multiline
                rows={4}
                fullWidth
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
              <Button
                onClick={handleSubmit}
                variant="contained"
                disabled={!selectedFile}
              >
                Nộp bài
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </Paper>
  );
};

export default AssignmentDetail;