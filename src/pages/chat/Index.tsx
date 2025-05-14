import React, { useState, useEffect } from 'react'; // ✅ Thêm useEffect
import {
  Grid,
  Box,
  Paper,
  CssBaseline,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import StudentList from './StudentList';
import ChatBox from './ChatBox';
import StudentProfile from './StudentProfile';
import ChatToolbar from './ChatToolbar';
import { Student, Message, StudentProgress } from './types';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#4791db',
      dark: '#115293',
    },
    secondary: {
      main: '#f50057',
      light: '#ff4081',
      dark: '#c51162',
    },
    background: {
      default: '#f5f7fa',
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      'Helvetica Neue',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 10px 0 rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

const sampleStudents: Student[] = [
  { id: '22520001', name: 'Nguyễn Văn A', status: 'online' },
  { id: '22520002', name: 'Trần Thị B', status: 'offline' },
  { id: '22520003', name: 'Lê Văn C', status: 'offline' },
  { id: '22520004', name: 'Phạm Thị D', status: 'offline' },
  { id: '22520005', name: 'Võ Minh E', status: 'offline' },
];

const sampleMessages: Message[] = [
  {
    id: '1',
    sender: 'Giáo viên',
    senderType: 'teacher',
    content: 'Hãy sửa vòng lặp thành i < n thay vì i <= n.',
    timestamp: '2024-07-21T14:50:00'
  },
  {
    id: '2',
    sender: 'Nguyễn Văn A',
    senderType: 'student',
    content: 'Cảm ơn thầy, em đã hiểu vấn đề rồi. Em sẽ sửa lại code.',
    timestamp: '2024-07-21T14:52:00'
  },
  {
    id: '3',
    sender: 'Giáo viên',
    senderType: 'teacher',
    content: 'Không có gì. Bạn cũng đừng quên giải phóng bộ nhớ sau khi sử dụng malloc bằng cách gọi free(arr) trước khi kết thúc hàm main nhé.',
    timestamp: '2024-07-21T14:55:00'
  },
  {
    id: '4',
    sender: 'AI Tutor',
    senderType: 'ai',
    content: 'Suggestion: Tôi có thể cung cấp thêm ví dụ về cách sử dụng malloc đúng cách và giải thích về lỗi buffer overflow nếu sinh viên cần hiểu sâu hơn về vấn đề này.',
    timestamp: '2024-07-21T14:57:00'
  },
];

const sampleProgress: StudentProgress = {
  currentScore: 8.5,
  totalScore: 10,
  currentChapter: 5,
  totalChapters: 10,
  completionPercentage: 60,
};

const Index: React.FC = () => {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(sampleStudents[0]);
  const [messages, setMessages] = useState<Message[]>(sampleMessages);
  const [isAITutorEnabled, setIsAITutorEnabled] = useState<boolean>(false);
  const [currentClass, setCurrentClass] = useState<string>("C Programming - C01");

  // ✅ Scroll về top khi component mount
  useEffect(() => {
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    });
  }, []);

  const handleSelectStudent = (student: Student) => {
    setSelectedStudent(student);
  };

  const handleSendMessage = (content: string) => {
    if (!selectedStudent) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      sender: 'Giáo viên',
      senderType: 'teacher',
      content,
      timestamp: new Date().toISOString(),
    };

    setMessages([...messages, newMessage]);

    if (content.includes('?')) {
      setTimeout(() => {
        const studentResponse: Message = {
          id: `msg-${Date.now() + 1}`,
          sender: selectedStudent.name,
          senderType: 'student',
          content: 'Vâng thầy, em sẽ làm theo hướng dẫn của thầy ạ.',
          timestamp: new Date().toISOString(),
        };
        setMessages(prev => [...prev, studentResponse]);
      }, 2000);
    }

    if (isAITutorEnabled && Math.random() > 0.5) {
      setTimeout(() => {
        const aiResponse: Message = {
          id: `msg-${Date.now() + 2}`,
          sender: 'AI Tutor',
          senderType: 'ai',
          content: 'Tôi nhận thấy đây là một lỗi phổ biến liên quan đến quản lý bộ nhớ. Có thể bổ sung thêm kiểm tra NULL sau khi sử dụng malloc để tránh các lỗi không mong muốn.',
          timestamp: new Date().toISOString(),
        };
        setMessages(prev => [...prev, aiResponse]);
      }, 3500);
    }
  };

  const handleToggleAITutor = () => {
    setIsAITutorEnabled(!isAITutorEnabled);

    if (!isAITutorEnabled) {
      const aiMessage: Message = {
        id: `msg-${Date.now()}`,
        sender: 'AI Tutor',
        senderType: 'ai',
        content: 'AI Tutor đã được kích hoạt. Tôi sẽ theo dõi cuộc trò chuyện và cung cấp gợi ý khi cần thiết.',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, aiMessage]);
    }
  };

  const handleClassChange = (className: string) => {
    setCurrentClass(className);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
        <Box sx={{ flexGrow: 1 }}>
          <Box sx={{ mb: 1 }}>
            <ChatToolbar
              currentClass={currentClass}
              onClassChange={handleClassChange}
            />
          </Box>

          <Grid container spacing={3} sx={{ height: 'calc(100vh - 120px)' }}>
            <Grid item xs={12} md={3} sx={{ height: '96%' }}>
              <Paper sx={{ height: '100%', overflow: 'hidden' }}>
                <StudentList
                  students={sampleStudents}
                  selectedStudentId={selectedStudent?.id || null}
                  onSelectStudent={handleSelectStudent}
                />
              </Paper>
            </Grid>

            <Grid item xs={12} md={6} sx={{ height: '96%' }}>
              <ChatBox
                className={currentClass}
                selectedStudent={selectedStudent}
                messages={messages}
                onSendMessage={handleSendMessage}
                onToggleAITutor={handleToggleAITutor}
                isAITutorEnabled={isAITutorEnabled}
              />
            </Grid>

            <Grid item xs={12} md={3} sx={{ height: '96%' }}>
              {selectedStudent && (
                <StudentProfile
                  student={selectedStudent}
                  progress={sampleProgress}
                />
              )}
            </Grid>
          </Grid>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Index;