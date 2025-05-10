import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// Định nghĩa các interface
export interface ChapterData {
  id: number;
  title: string;
  progress: number;
  quizScore: string;
  exercisesCompleted: string;
}

export interface ErrorData {
  name: string;
  count: number;
  percentage: number;
}

export interface Suggestion {
  id: number;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'success';
}

export interface StudentInfo {
  name: string;
  studentId: string;
  courseLevel: string;
  updateDate: string;
}

export interface SummaryStatsData {
  totalLearningTime: string;
  successfulCompilations: number;
  failedCompilations: number;
  successRate: string;
  dailyAverageTime: string;
  mostCommonError?: string;
}

export interface StudentProgressData {
  studentInfo: StudentInfo;
  chapters: ChapterData[];
  summaryStats: SummaryStatsData;
  errors: ErrorData[];
  suggestions: Suggestion[];
}

// Định nghĩa state
export interface StudentProgressState {
  data: StudentProgressData | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// State ban đầu
const initialState: StudentProgressState = {
  data: null,
  status: 'idle',
  error: null
};

// Thunk Action để lấy dữ liệu từ API
export const fetchStudentProgress = createAsyncThunk(
  'studentProgress/fetchStudentProgress',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('https://run.mocky.io/v3/80fe6b83-834f-4b00-88d4-f5e0b95851e1');
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Đã xảy ra lỗi khi tải dữ liệu';
      return rejectWithValue(errorMessage);
    }
  }
);

// Tạo slice
const studentProgressSlice = createSlice({
  name: 'studentProgress',
  initialState,
  reducers: {
    clearErrorMessage(state) {
      state.error = null;
    },
    resetStudentProgress(state) {
      return { ...initialState };
    },
    updateChapterProgress(state, action: PayloadAction<ChapterData>) {
      if (state.data?.chapters) {
        const index = state.data.chapters.findIndex(chapter => chapter.id === action.payload.id);
        if (index !== -1) {
          state.data.chapters[index] = action.payload;
        }
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudentProgress.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchStudentProgress.fulfilled, (state, action: PayloadAction<StudentProgressData>) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchStudentProgress.rejected, (state, action: PayloadAction<any>) => {
        state.status = 'failed';
        state.error = action.payload || 'Không thể tải dữ liệu tiến độ học tập';
      });
  },
  selectors: {
    selectStudentProgressData: (state) => state.data,
    selectStudentInfo: (state) => state.data?.studentInfo,
    selectChapters: (state) => state.data?.chapters,
    selectSummaryStats: (state) => state.data?.summaryStats,
    selectErrors: (state) => state.data?.errors,
    selectSuggestions: (state) => state.data?.suggestions,
    selectStatus: (state) => state.status,
    selectErrorMessage: (state) => state.error
  }
});

// Export actions
export const {
  clearErrorMessage,
  resetStudentProgress,
  updateChapterProgress
} = studentProgressSlice.actions;

// Export selectors
export const {
  selectStudentProgressData,
  selectStudentInfo,
  selectChapters,
  selectSummaryStats,
  selectErrors,
  selectSuggestions,
  selectStatus,
  selectErrorMessage
} = studentProgressSlice.selectors;

// Export reducer
export default studentProgressSlice.reducer;