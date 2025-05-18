// src/redux/slices/chatTutorSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_ENDPOINTS } from '@/common/constants/apis';

// Types for message data
export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: number;
}

// Types for quick suggestion buttons
export interface QuickSuggestion {
  id: string;
  text: string;
}

// Chat state interface
export interface ChatState {
  messages: Message[];
  isTyping: boolean;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  suggestions: QuickSuggestion[];
  currentTopic: string;
}

// Initial state
const initialState: ChatState = {
  messages: [],
  isTyping: false,
  status: 'idle',
  error: null,
  suggestions: [
    { id: 'pointer', text: 'Giải thích về con trỏ trong C' },
    { id: 'debug', text: 'Giúp tôi gỡ lỗi đoạn mã này' },
    { id: 'memory', text: 'Cấp phát bộ nhớ là gì?' },
    { id: 'struct', text: 'Cấu trúc struct trong C' },
    { id: 'algorithm', text: 'Thuật toán sắp xếp trong C' }
  ],
  currentTopic: 'Lập Trình C'
};

// Async thunk for sending messages to AI
export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async (message: string, { rejectWithValue, getState }) => {
    try {
      // Lấy lịch sử tin nhắn từ state
      const state = getState() as { chat: ChatState };
      const messageHistory = state.chat.messages;
      
      // Gọi API để gửi tin nhắn và nhận phản hồi
      const response = await axios.post(API_ENDPOINTS.CHAT_TUTOR.SEND_MESSAGE, {
        message,
        history: messageHistory.map(msg => ({
          content: msg.content,
          role: msg.sender === 'user' ? 'user' : 'assistant'
        }))
      });

      return response.data;
    } catch (error: any) {
      // Xử lý lỗi và trả về thông báo lỗi
      return rejectWithValue(error.response?.data?.message || 'Không thể kết nối đến trợ lý AI');
    }
  }
);

// Async thunk để lấy gợi ý
export const fetchSuggestions = createAsyncThunk(
  'chat/fetchSuggestions',
  async (topic: string = 'Lập Trình C', { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_ENDPOINTS.CHAT_TUTOR.GET_SUGGESTIONS}?topic=${topic}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể lấy gợi ý');
    }
  }
);

// Async thunk để lưu cuộc trò chuyện
export const saveChat = createAsyncThunk(
  'chat/saveChat',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { chat: ChatState };
      const { messages, currentTopic } = state.chat;
      
      const response = await axios.post(API_ENDPOINTS.CHAT_TUTOR.SAVE_CHAT, {
        messages,
        topic: currentTopic,
        timestamp: Date.now()
      });
      
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể lưu cuộc trò chuyện');
    }
  }
);

// Async thunk để tải lịch sử trò chuyện
export const loadChatHistory = createAsyncThunk(
  'chat/loadChatHistory',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_ENDPOINTS.CHAT_TUTOR.GET_HISTORY);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể tải lịch sử trò chuyện');
    }
  }
);

// Async thunk để tải lên mã nguồn
export const uploadCode = createAsyncThunk(
  'chat/uploadCode',
  async (file: File, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await axios.post(API_ENDPOINTS.CHAT_TUTOR.UPLOAD_CODE, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể tải lên mã nguồn');
    }
  }
);

// Create the chat slice
const chatTutorSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage(state, action: PayloadAction<{ content: string; sender: 'user' | 'ai' }>) {
      const { content, sender } = action.payload;
      state.messages.push({
        id: Date.now().toString(),
        content,
        sender,
        timestamp: Date.now()
      });
    },
    setTyping(state, action: PayloadAction<boolean>) {
      state.isTyping = action.payload;
    },
    clearChat(state) {
      state.messages = [];
    },
    updateSuggestions(state, action: PayloadAction<QuickSuggestion[]>) {
      state.suggestions = action.payload;
    },
    setCurrentTopic(state, action: PayloadAction<string>) {
      state.currentTopic = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Xử lý trạng thái khi gửi tin nhắn
      .addCase(sendMessage.pending, (state) => {
        state.status = 'loading';
        state.isTyping = true;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.isTyping = false;
        // Thêm phản hồi từ AI vào danh sách tin nhắn
        state.messages.push({
          id: Date.now().toString(),
          content: action.payload.response || action.payload.message || 'Không có phản hồi',
          sender: 'ai',
          timestamp: Date.now()
        });
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.status = 'failed';
        state.isTyping = false;
        state.error = action.payload as string || 'Không thể nhận phản hồi';
        // Thêm thông báo lỗi như một tin nhắn từ AI
        state.messages.push({
          id: Date.now().toString(),
          content: `Xin lỗi, tôi đang gặp sự cố kỹ thuật. ${action.payload || 'Vui lòng thử lại sau.'}`,
          sender: 'ai',
          timestamp: Date.now()
        });
      })
      
      // Xử lý trạng thái khi lấy gợi ý
      .addCase(fetchSuggestions.fulfilled, (state, action) => {
        if (action.payload.suggestions && Array.isArray(action.payload.suggestions)) {
          state.suggestions = action.payload.suggestions;
        }
        if (action.payload.topic) {
          state.currentTopic = action.payload.topic;
        }
      })
      
      // Xử lý trạng thái khi lưu cuộc trò chuyện
      .addCase(saveChat.fulfilled, (state, action) => {
        // Có thể thêm thông báo thành công nếu cần
      })
      .addCase(saveChat.rejected, (state, action) => {
        state.error = action.payload as string || 'Không thể lưu cuộc trò chuyện';
      })
      
      // Xử lý trạng thái khi tải lịch sử trò chuyện
      .addCase(loadChatHistory.fulfilled, (state, action) => {
        if (action.payload.messages && Array.isArray(action.payload.messages)) {
          state.messages = action.payload.messages;
        }
        if (action.payload.topic) {
          state.currentTopic = action.payload.topic;
        }
      })
      
      // Xử lý trạng thái khi tải lên mã nguồn
      .addCase(uploadCode.fulfilled, (state, action) => {
        // Thêm tin nhắn từ người dùng với nội dung mã nguồn
        if (action.payload.code) {
          state.messages.push({
            id: Date.now().toString(),
            content: `\`\`\`\n${action.payload.code}\n\`\`\``,
            sender: 'user',
            timestamp: Date.now()
          });
        }
      });
  },
  selectors: {
    selectMessages: (state) => state.messages,
    selectIsTyping: (state) => state.isTyping,
    selectStatus: (state) => state.status,
    selectError: (state) => state.error,
    selectSuggestions: (state) => state.suggestions,
    selectCurrentTopic: (state) => state.currentTopic
  }
});

// Export actions
export const {
  addMessage,
  setTyping,
  clearChat,
  updateSuggestions,
  setCurrentTopic
} = chatTutorSlice.actions;

// Export selectors
export const {
  selectMessages,
  selectIsTyping,
  selectStatus,
  selectError,
  selectSuggestions,
  selectCurrentTopic
} = chatTutorSlice.selectors;

// Export reducer
export default chatTutorSlice.reducer;