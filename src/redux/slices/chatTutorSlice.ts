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
  isCode?: boolean;
  codeLanguage?: string;
  feedback?: {
    helpful: boolean;
    reason?: string;
  };
}

// Types for quick suggestion buttons
export interface QuickSuggestion {
  id: string;
  text: string;
  category?: 'concept' | 'debug' | 'exercise' | 'general';
}

// Types for learning context
export interface LearningContext {
  course: string;
  chapter?: string;
  topic: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  learningMode: boolean;
  directMode: boolean;
}

// Types for chat history
export interface ChatSession {
  id: string;
  title: string;
  timestamp: number;
  topic: string;
  messageCount: number;
  lastMessage: string;
}

// Chat state interface
export interface ChatState {
  messages: Message[];
  isTyping: boolean;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  suggestions: QuickSuggestion[];
  currentTopic: string;
  learningContext: LearningContext;
  chatHistory: ChatSession[];
  activeSession: string | null;
  codeSnippets: { [key: string]: string };
  showExplanationMode: boolean;
}

// Initial state
const initialState: ChatState = {
  messages: [],
  isTyping: false,
  status: 'idle',
  error: null,
  suggestions: [
    { id: 'pointer', text: 'Giải thích về con trỏ trong C', category: 'concept' },
    { id: 'debug', text: 'Giúp tôi gỡ lỗi đoạn mã này', category: 'debug' },
    { id: 'memory', text: 'Cấp phát bộ nhớ là gì?', category: 'concept' },
    { id: 'struct', text: 'Cấu trúc struct trong C', category: 'concept' },
    { id: 'algorithm', text: 'Thuật toán sắp xếp trong C', category: 'concept' },
    { id: 'exercise', text: 'Bài tập về mảng trong C', category: 'exercise' },
    { id: 'recursion', text: 'Giải thích về đệ quy', category: 'concept' },
    { id: 'file', text: 'Cách đọc và ghi file trong C', category: 'concept' }
  ],
  currentTopic: 'Lập Trình C',
  learningContext: {
    course: 'Lập Trình C',
    topic: 'Lập Trình C Cơ Bản',
    difficulty: 'beginner',
    learningMode: true,
    directMode: false
  },
  chatHistory: [],
  activeSession: null,
  codeSnippets: {},
  showExplanationMode: false
};

// Async thunk for sending messages to AI
export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async (
    payload: { 
      message: string; 
      isCode?: boolean; 
      codeLanguage?: string;
      requestExplanation?: boolean;
    }, 
    { rejectWithValue, getState }
  ) => {
    try {
      // Lấy lịch sử tin nhắn và context học tập từ state
      const state = getState() as { chatTutor: ChatState };
      const { messages, learningContext } = state.chatTutor;
      const { message, isCode, codeLanguage, requestExplanation } = payload;
      
      // Gọi API để gửi tin nhắn và nhận phản hồi
      const response = await axios.post(API_ENDPOINTS.CHAT_TUTOR.SEND_MESSAGE, {
        message,
        isCode: isCode || false,
        codeLanguage: codeLanguage || 'c',
        history: messages.map(msg => ({
          content: msg.content,
          role: msg.sender === 'user' ? 'user' : 'assistant',
          isCode: msg.isCode || false
        })),
        learningContext: {
          ...learningContext,
          requestExplanation: requestExplanation || false
        }
      });

      return {
        ...response.data,
        originalMessage: message,
        isCode,
        codeLanguage
      };
    } catch (error: any) {
      // Xử lý lỗi và trả về thông báo lỗi
      return rejectWithValue(error.response?.data?.message || 'Không thể kết nối đến trợ lý AI');
    }
  }
);

// Async thunk để lấy gợi ý dựa trên ngữ cảnh học tập
export const fetchSuggestions = createAsyncThunk(
  'chat/fetchSuggestions',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { chatTutor: ChatState };
      const { learningContext } = state.chatTutor;
      
      const response = await axios.get(API_ENDPOINTS.CHAT_TUTOR.GET_SUGGESTIONS, {
        params: {
          topic: learningContext.topic,
          course: learningContext.course,
          chapter: learningContext.chapter,
          difficulty: learningContext.difficulty
        }
      });
      
      return response.data;
    } catch (error: any) {
      // Trong môi trường phát triển, trả về gợi ý mặc định
      return {
        suggestions: [
          { id: 'pointer', text: 'Giải thích về con trỏ trong C', category: 'concept' },
          { id: 'debug', text: 'Giúp tôi gỡ lỗi đoạn mã này', category: 'debug' },
          { id: 'memory', text: 'Cấp phát bộ nhớ là gì?', category: 'concept' },
          { id: 'struct', text: 'Cấu trúc struct trong C', category: 'concept' },
          { id: 'algorithm', text: 'Thuật toán sắp xếp trong C', category: 'concept' },
          { id: 'exercise', text: 'Bài tập về mảng trong C', category: 'exercise' },
          { id: 'recursion', text: 'Giải thích về đệ quy', category: 'concept' },
          { id: 'file', text: 'Cách đọc và ghi file trong C', category: 'concept' }
        ],
        topic: 'Lập Trình C'
      };
      
      // Trong môi trường production, trả về lỗi
      // return rejectWithValue(error.response?.data?.message || 'Không thể lấy gợi ý');
    }
  }
);

// Async thunk để lưu cuộc trò chuyện
export const saveChat = createAsyncThunk(
  'chat/saveChat',
  async (title: string | undefined, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { chatTutor: ChatState };
      const { messages, currentTopic, learningContext } = state.chatTutor;
      
      const sessionTitle = title || `Cuộc trò chuyện về ${currentTopic} - ${new Date().toLocaleDateString()}`;
      
      const response = await axios.post(API_ENDPOINTS.CHAT_TUTOR.SAVE_CHAT, {
        title: sessionTitle,
        messages,
        topic: currentTopic,
        learningContext,
        timestamp: Date.now()
      });
      
      return {
        ...response.data,
        title: sessionTitle
      };
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
      // Trong môi trường phát triển, trả về lịch sử mẫu
      return {
        sessions: [
          {
            id: '1',
            title: 'Học về con trỏ trong C',
            timestamp: Date.now() - 86400000, // 1 ngày trước
            topic: 'Lập Trình C',
            messageCount: 8,
            lastMessage: 'Cảm ơn bạn đã giải thích rõ ràng!'
          },
          {
            id: '2',
            title: 'Gỡ lỗi chương trình sắp xếp',
            timestamp: Date.now() - 172800000, // 2 ngày trước
            topic: 'Lập Trình C',
            messageCount: 12,
            lastMessage: 'Đã hiểu vấn đề, cảm ơn trợ lý!'
          }
        ]
      };
      
      // Trong môi trường production, trả về lỗi
      // return rejectWithValue(error.response?.data?.message || 'Không thể tải lịch sử trò chuyện');
    }
  }
);

// Async thunk để tải một phiên chat cụ thể
export const loadChatSession = createAsyncThunk(
  'chat/loadChatSession',
  async (sessionId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_ENDPOINTS.CHAT_TUTOR.GET_HISTORY}/${sessionId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể tải phiên trò chuyện');
    }
  }
);

// Async thunk để tải lên mã nguồn
export const uploadCode = createAsyncThunk(
  'chat/uploadCode',
  async (
    payload: { 
      file: File; 
      language?: string; 
      requestAnalysis?: boolean;
    }, 
    { rejectWithValue }
  ) => {
    try {
      const { file, language = 'c', requestAnalysis = true } = payload;
      const formData = new FormData();
      formData.append('file', file);
      formData.append('language', language);
      formData.append('requestAnalysis', String(requestAnalysis));
      
      const response = await axios.post(API_ENDPOINTS.CHAT_TUTOR.UPLOAD_CODE, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return {
        ...response.data,
        fileName: file.name,
        language
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể tải lên mã nguồn');
    }
  }
);

// Async thunk để gửi phản hồi về câu trả lời
export const sendFeedback = createAsyncThunk(
  'chat/sendFeedback',
  async (
    payload: { 
      messageId: string; 
      helpful: boolean; 
      reason?: string;
    }, 
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(API_ENDPOINTS.CHAT_TUTOR.SEND_FEEDBACK, payload);
      return {
        ...response.data,
        ...payload
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể gửi phản hồi');
    }
  }
);

// Create the chat slice
const chatTutorSlice = createSlice({
  name: 'chatTutor',
  initialState,
  reducers: {
    addMessage(state, action: PayloadAction<{ 
      content: string; 
      sender: 'user' | 'ai';
      isCode?: boolean;
      codeLanguage?: string;
    }>) {
      const { content, sender, isCode, codeLanguage } = action.payload;
      state.messages.push({
        id: Date.now().toString(),
        content,
        sender,
        timestamp: Date.now(),
        isCode: isCode || false,
        codeLanguage: codeLanguage
      });
    },
    setTyping(state, action: PayloadAction<boolean>) {
      state.isTyping = action.payload;
    },
    clearChat(state) {
      state.messages = [];
      state.activeSession = null;
    },
    updateSuggestions(state, action: PayloadAction<QuickSuggestion[]>) {
      state.suggestions = action.payload;
    },
    setCurrentTopic(state, action: PayloadAction<string>) {
      state.currentTopic = action.payload;
      state.learningContext.topic = action.payload;
    },
    updateLearningContext(state, action: PayloadAction<Partial<LearningContext>>) {
      state.learningContext = {
        ...state.learningContext,
        ...action.payload
      };
    },
    toggleLearningMode(state) {
      state.learningContext.learningMode = !state.learningContext.learningMode;
    },
    toggleDirectMode(state) {
      state.learningContext.directMode = !state.learningContext.directMode;
    },
    toggleExplanationMode(state) {
      state.showExplanationMode = !state.showExplanationMode;
    },
    setActiveSession(state, action: PayloadAction<string | null>) {
      state.activeSession = action.payload;
    },
    addCodeSnippet(state, action: PayloadAction<{ id: string; code: string }>) {
      const { id, code } = action.payload;
      state.codeSnippets[id] = code;
    },
    provideFeedback(state, action: PayloadAction<{ 
      messageId: string; 
      helpful: boolean; 
      reason?: string 
    }>) {
      const { messageId, helpful, reason } = action.payload;
      const messageIndex = state.messages.findIndex(msg => msg.id === messageId);
      if (messageIndex !== -1) {
        state.messages[messageIndex].feedback = { helpful, reason };
      }
    },
    clearError(state) {
      state.error = null;
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
        state.error = null;
        
        // Thêm phản hồi từ AI vào danh sách tin nhắn
        const responseContent = action.payload.response || action.payload.message || 'Không có phản hồi';
        const messageId = Date.now().toString();
        
        state.messages.push({
          id: messageId,
          content: responseContent,
          sender: 'ai',
          timestamp: Date.now(),
          isCode: action.payload.isCodeResponse || false,
          codeLanguage: action.payload.codeLanguage
        });
        
        // Nếu có giải thích bổ sung và đang ở chế độ học
        if (action.payload.explanation && state.learningContext.learningMode) {
          // Thêm tin nhắn giải thích từ AI
          state.messages.push({
            id: (Date.now() + 1).toString(),
            content: `**Giải thích thêm:** ${action.payload.explanation}`,
            sender: 'ai',
            timestamp: Date.now() + 1
          });
        }
        
        // Nếu có gợi ý bổ sung
        if (action.payload.additionalSuggestions && Array.isArray(action.payload.additionalSuggestions)) {
          state.suggestions = [
            ...state.suggestions,
            ...action.payload.additionalSuggestions.filter(
              (sugg: QuickSuggestion) => !state.suggestions.some(s => s.id === sugg.id)
            )
          ];
        }
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
          state.learningContext.topic = action.payload.topic;
        }
      })
      
      // Xử lý trạng thái khi lưu cuộc trò chuyện
      .addCase(saveChat.fulfilled, (state, action) => {
        // Thêm phiên chat mới vào lịch sử
        const newSession: ChatSession = {
          id: action.payload.sessionId || Date.now().toString(),
          title: action.payload.title,
          timestamp: Date.now(),
          topic: state.currentTopic,
          messageCount: state.messages.length,
          lastMessage: state.messages.length > 0 
            ? state.messages[state.messages.length - 1].content.substring(0, 50) + '...'
            : 'Không có tin nhắn'
        };
        
        // Thêm vào đầu mảng để hiển thị phiên mới nhất trước
        state.chatHistory = [newSession, ...state.chatHistory];
        state.activeSession = newSession.id;
      })
      .addCase(saveChat.rejected, (state, action) => {
        state.error = action.payload as string || 'Không thể lưu cuộc trò chuyện';
      })
      
      // Xử lý trạng thái khi tải lịch sử trò chuyện
      .addCase(loadChatHistory.fulfilled, (state, action) => {
        if (action.payload.sessions && Array.isArray(action.payload.sessions)) {
          state.chatHistory = action.payload.sessions;
        }
      })
      
      // Xử lý trạng thái khi tải một phiên chat cụ thể
      .addCase(loadChatSession.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loadChatSession.fulfilled, (state, action) => {
        state.status = 'succeeded';
        
        if (action.payload.messages && Array.isArray(action.payload.messages)) {
          state.messages = action.payload.messages;
        }
        if (action.payload.topic) {
          state.currentTopic = action.payload.topic;
        }
        if (action.payload.learningContext) {
          state.learningContext = action.payload.learningContext;
        }
        
        state.activeSession = action.payload.sessionId;
      })
      .addCase(loadChatSession.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Không thể tải phiên trò chuyện';
      })
      
      // Xử lý trạng thái khi tải lên mã nguồn
      .addCase(uploadCode.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(uploadCode.fulfilled, (state, action) => {
        state.status = 'succeeded';
        
        // Lưu mã nguồn vào state
        const codeId = Date.now().toString();
        if (action.payload.code) {
          state.codeSnippets[codeId] = action.payload.code;
          
          // Thêm tin nhắn từ người dùng với nội dung mã nguồn
          state.messages.push({
            id: codeId,
            content: `\`\`\`${action.payload.language || 'c'}\n${action.payload.code}\n\`\`\``,
            sender: 'user',
            timestamp: Date.now(),
            isCode: true,
            codeLanguage: action.payload.language || 'c'
          });
          
          // Nếu có phân tích mã nguồn, thêm phản hồi từ AI
          if (action.payload.analysis) {
            state.messages.push({
              id: (Date.now() + 1).toString(),
              content: action.payload.analysis,
              sender: 'ai',
              timestamp: Date.now() + 1
            });
          }
        }
      })
      .addCase(uploadCode.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Không thể tải lên mã nguồn';
      })
      
      // Xử lý trạng thái khi gửi phản hồi
      .addCase(sendFeedback.fulfilled, (state, action) => {
        const { messageId, helpful, reason } = action.payload;
        const messageIndex = state.messages.findIndex(msg => msg.id === messageId);
        
        if (messageIndex !== -1) {
          state.messages[messageIndex].feedback = { helpful, reason };
        }
      });
  }
});

// Export actions
export const {
  addMessage,
  setTyping,
  clearChat,
  updateSuggestions,
  setCurrentTopic,
  updateLearningContext,
  toggleLearningMode,
  toggleDirectMode,
  toggleExplanationMode,
  setActiveSession,
  addCodeSnippet,
  provideFeedback,
  clearError
} = chatTutorSlice.actions;

// Export selectors
export const selectMessages = (state: { chatTutor: ChatState }) => state.chatTutor.messages;
export const selectIsTyping = (state: { chatTutor: ChatState }) => state.chatTutor.isTyping;
export const selectStatus = (state: { chatTutor: ChatState }) => state.chatTutor.status;
export const selectError = (state: { chatTutor: ChatState }) => state.chatTutor.error;
export const selectSuggestions = (state: { chatTutor: ChatState }) => state.chatTutor.suggestions;
export const selectCurrentTopic = (state: { chatTutor: ChatState }) => state.chatTutor.currentTopic;
export const selectLearningContext = (state: { chatTutor: ChatState }) => state.chatTutor.learningContext;
export const selectChatHistory = (state: { chatTutor: ChatState }) => state.chatTutor.chatHistory;
export const selectActiveSession = (state: { chatTutor: ChatState }) => state.chatTutor.activeSession;
export const selectCodeSnippets = (state: { chatTutor: ChatState }) => state.chatTutor.codeSnippets;
export const selectShowExplanationMode = (state: { chatTutor: ChatState }) => state.chatTutor.showExplanationMode;

// Export reducer
export default chatTutorSlice.reducer;