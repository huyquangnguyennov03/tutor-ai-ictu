import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Define types
export interface Message {
  id: string;
  senderId: string;
  senderType: 'teacher' | 'student';
  senderName: string;
  content: string;
  timestamp: string;
}

export interface Student {
  id: string;
  name: string;
  studentId: string;
  isOnline: boolean;
  hasUnread: boolean;
  lastActivity?: string;
  status?: 'online' | 'offline' | 'away' | 'excellent';
}

export interface ChatState {
  students: Student[];
  currentStudentId: string | null;
  messages: Record<string, Message[]>;
  isLoading: boolean;
  error: string | null;
  filter: string;
  sortBy: 'name' | 'lastActivity' | 'status';
}

const initialState: ChatState = {
  students: [],
  currentStudentId: null,
  messages: {},
  isLoading: false,
  error: null,
  filter: '',
  sortBy: 'name'
};

// Async thunks
export const fetchStudents = createAsyncThunk(
  'teacherStudentChat/fetchStudents',
  async (classId: string) => {
    // In a real app, this would be an API call
    const students: Student[] = [
      { id: '1', name: 'Nguyễn Văn A', studentId: '22520001', isOnline: true, hasUnread: false, status: 'online' },
      { id: '2', name: 'Trần Thị B', studentId: '22520002', isOnline: false, hasUnread: true, status: 'away' },
      { id: '3', name: 'Lê Văn C', studentId: '22520003', isOnline: false, hasUnread: false, status: 'excellent' }
    ];
    return students;
  }
);

export const fetchMessages = createAsyncThunk(
  'teacherStudentChat/fetchMessages',
  async (studentId: string) => {
    // In a real app, this would be an API call
    const messages: Message[] = [
      {
        id: '1',
        senderId: '1',
        senderType: 'student',
        senderName: 'Nguyễn Văn A',
        content: 'Thầy ơi, em có vấn đề với bài tập Lab 4. Em không hiểu tại sao code của em bị segmentation fault khi chạy.',
        timestamp: '2024-07-21T14:30:00'
      },
      {
        id: '2',
        senderId: 'teacher',
        senderType: 'teacher',
        senderName: 'Giáo viên',
        content: 'Chào bạn, bạn hãy gửi đoạn code của mình để tôi xem nhé.',
        timestamp: '2024-07-21T14:35:00'
      }
    ];
    return { studentId, messages };
  }
);

export const sendMessage = createAsyncThunk(
  'teacherStudentChat/sendMessage',
  async ({ studentId, content, senderType }: { studentId: string; content: string; senderType: 'teacher' | 'student' }) => {
    // In a real app, this would be an API call
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: senderType === 'teacher' ? 'teacher' : studentId,
      senderType,
      senderName: senderType === 'teacher' ? 'Giáo viên' : 'Nguyễn Văn A',
      content,
      timestamp: new Date().toISOString()
    };
    return { studentId, message: newMessage };
  }
);

const teacherStudentChatSlice = createSlice({
  name: 'teacherStudentChat',
  initialState,
  reducers: {
    setCurrentStudent: (state, action: PayloadAction<string>) => {
      state.currentStudentId = action.payload;
      // Mark messages as read
      const student = state.students.find(s => s.id === action.payload);
      if (student) {
        student.hasUnread = false;
      }
    },
    setFilter: (state, action: PayloadAction<string>) => {
      state.filter = action.payload;
    },
    setSortBy: (state, action: PayloadAction<'name' | 'lastActivity' | 'status'>) => {
      state.sortBy = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchStudents
      .addCase(fetchStudents.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.students = action.payload;
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Không thể tải danh sách sinh viên';
      })

      // Handle fetchMessages
      .addCase(fetchMessages.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.messages[action.payload.studentId] = action.payload.messages;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Không thể tải tin nhắn';
      })

      // Handle sendMessage
      .addCase(sendMessage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isLoading = false;
        const { studentId, message } = action.payload;

        if (!state.messages[studentId]) {
          state.messages[studentId] = [];
        }

        state.messages[studentId].push(message);

        // If the message is from a student and not the current conversation, mark as unread
        if (message.senderType === 'student' && state.currentStudentId !== studentId) {
          const student = state.students.find(s => s.id === studentId);
          if (student) {
            student.hasUnread = true;
          }
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Không thể gửi tin nhắn';
      });
  }
});

export const { setCurrentStudent, setFilter, setSortBy } = teacherStudentChatSlice.actions;

export default teacherStudentChatSlice.reducer;