import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_ENDPOINTS, API_BASE_URL } from '@/common/constants/apis';

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
  async (classId: string, { rejectWithValue }) => {
    try {
      // Sử dụng API thực tế để lấy danh sách sinh viên
      const response = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.STUDENTS.GET_STUDENTS}`);
      
      // Chuyển đổi dữ liệu từ API thành định dạng phù hợp với ứng dụng
      const students: Student[] = response.data.map((student: any) => ({
        id: student.studentid.toString(),
        name: student.name,
        studentId: student.mssv,
        isOnline: Math.random() > 0.5, // Giả định trạng thái online
        hasUnread: false,
        lastActivity: new Date().toISOString(),
        status: student.totalgpa > 3.5 ? 'excellent' : 
                Math.random() > 0.5 ? 'online' : 'offline'
      }));
      
      return students;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Không thể tải danh sách sinh viên');
    }
  }
);

export const fetchMessages = createAsyncThunk(
  'teacherStudentChat/fetchMessages',
  async (studentId: string, { rejectWithValue }) => {
    try {
      // Trong thực tế, cần có API endpoint riêng cho chức năng này
      // Hiện tại, tạo dữ liệu mẫu
      
      // Lấy thông tin sinh viên
      const studentsResponse = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.STUDENTS.GET_STUDENTS}`);
      const student = studentsResponse.data.find((s: any) => s.studentid.toString() === studentId);
      
      if (!student) {
        throw new Error('Không tìm thấy sinh viên');
      }
      
      // Tạo tin nhắn mẫu
      const messages: Message[] = [
        {
          id: '1',
          senderId: studentId,
          senderType: 'student',
          senderName: student.name,
          content: 'Thầy ơi, em có vấn đề với bài tập Lab 4. Em không hiểu tại sao code của em bị segmentation fault khi chạy.',
          timestamp: new Date(Date.now() - 3600000).toISOString() // 1 giờ trước
        },
        {
          id: '2',
          senderId: 'teacher',
          senderType: 'teacher',
          senderName: 'Giáo viên',
          content: 'Chào bạn, bạn hãy gửi đoạn code của mình để tôi xem nhé.',
          timestamp: new Date(Date.now() - 3300000).toISOString() // 55 phút trước
        }
      ];
      
      return { studentId, messages };
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Không thể tải tin nhắn');
    }
  }
);

export const sendMessage = createAsyncThunk(
  'teacherStudentChat/sendMessage',
  async ({ studentId, content, senderType }: { studentId: string; content: string; senderType: 'teacher' | 'student' }, { rejectWithValue }) => {
    try {
      // Sử dụng API thực tế để gửi tin nhắn
      const response = await axios.post(`${API_BASE_URL}${API_ENDPOINTS.CHAT.SEND_MESSAGE}`, {
        senderid: senderType === 'teacher' ? 1 : parseInt(studentId), // ID của người gửi
        receiverid: senderType === 'teacher' ? parseInt(studentId) : 1, // ID của người nhận
        message: content
      });
      
      // Lấy thông tin sinh viên nếu cần
      let senderName = senderType === 'teacher' ? 'Giáo viên' : '';
      
      if (senderType === 'student') {
        const studentsResponse = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.STUDENTS.GET_STUDENTS}`);
        const student = studentsResponse.data.find((s: any) => s.studentid.toString() === studentId);
        senderName = student ? student.name : 'Sinh viên';
      }
      
      // Tạo đối tượng tin nhắn mới
      const newMessage: Message = {
        id: response.data.chatid.toString() || Date.now().toString(),
        senderId: senderType === 'teacher' ? 'teacher' : studentId,
        senderType,
        senderName,
        content,
        timestamp: new Date().toISOString()
      };
      
      return { studentId, message: newMessage };
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Không thể gửi tin nhắn');
    }
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