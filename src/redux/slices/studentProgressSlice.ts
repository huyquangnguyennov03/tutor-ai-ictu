import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_ENDPOINTS, API_BASE_URL } from '@/common/constants/apis';

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
  type: 'info' | 'warning' | 'success' | 'error';
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

// Thunk Action để lấy dữ liệu từ API dựa trên studentId
export const fetchStudentProgress = createAsyncThunk(
  'studentProgress/fetchStudentProgress',
  async (studentId: string, { rejectWithValue }) => {
    try {
      // Lấy thông tin sinh viên
      const studentsResponse = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.STUDENTS.GET_STUDENTS}`);
      const student = studentsResponse.data.find((s: any) => s.studentid.toString() === studentId || s.mssv === studentId);
      
      if (!student) {
        return rejectWithValue(`Không tìm thấy thông tin sinh viên với MSSV: ${studentId}`);
      }
      
      // Lấy tiến độ học tập của sinh viên
      const progressUrl = `${API_BASE_URL}${API_ENDPOINTS.STUDENTS.GET_STUDENT_PROGRESS.replace(':studentid', student.studentid.toString())}`;
      const progressResponse = await axios.get(progressUrl);
      
      // Lấy báo cáo chi tiết của sinh viên
      const reportUrl = `${API_BASE_URL}${API_ENDPOINTS.STUDENTS.GET_STUDENT_REPORT.replace(':studentid', student.studentid.toString())}`;
      const reportResponse = await axios.get(reportUrl);
      
      // Lấy dự đoán và đề xuất can thiệp
      const predictionUrl = `${API_BASE_URL}${API_ENDPOINTS.STUDENTS.PREDICT_INTERVENTION.replace(':studentid', student.studentid.toString())}`;
      const predictionResponse = await axios.get(predictionUrl);
      
      // Lấy chi tiết các chương học (giả định courseid = 1)
      const chaptersUrl = `${API_BASE_URL}${API_ENDPOINTS.CHAPTERS.GET_CHAPTER_DETAILS
        .replace(':studentid', student.studentid.toString())
        .replace(':courseid', '1')}`;
      const chaptersResponse = await axios.get(chaptersUrl);
      
      // Chuyển đổi dữ liệu từ API thành định dạng phù hợp với ứng dụng
      const studentInfo: StudentInfo = {
        name: student.name,
        studentId: student.mssv,
        courseLevel: 'Trung cấp', // Giả định
        updateDate: progressResponse.data[0]?.lastupdated || new Date().toISOString().split('T')[0]
      };
      
      const chapters: ChapterData[] = chaptersResponse.data.chapters.map((chapter: any, index: number) => ({
        id: chapter.chapterid,
        title: chapter.name,
        progress: chapter.completion_rate,
        quizScore: `${chapter.average_score}/10`,
        exercisesCompleted: `${Math.floor(chapter.completion_rate / 10)}/${Math.floor(chapter.completion_rate / 10) + 2}`
      }));
      
      // Tạo dữ liệu lỗi từ báo cáo
      const errors: ErrorData[] = reportResponse.data.bloom_assessments.map((assessment: any, index: number) => ({
        name: `Lỗi ${assessment.bloomlevel}`,
        count: Math.floor(Math.random() * 10) + 1, // Giả định
        percentage: Math.floor(Math.random() * 30) + 10 // Giả định
      }));
      
      // Tạo đề xuất từ dự đoán
      const suggestions: Suggestion[] = [
        {
          id: 1,
          title: 'Đề xuất học tập',
          content: predictionResponse.data.recommendation,
          type: predictionResponse.data.risk_level === 'An toàn' ? 'success' : 
                predictionResponse.data.risk_level === 'Cần cải thiện' ? 'warning' : 'error'
        }
      ];
      
      // Tạo thống kê tổng hợp
      const summaryStats: SummaryStatsData = {
        totalLearningTime: `${Math.floor(Math.random() * 100) + 20} giờ`, // Giả định
        successfulCompilations: Math.floor(Math.random() * 100) + 50, // Giả định
        failedCompilations: Math.floor(Math.random() * 30) + 10, // Giả định
        successRate: `${progressResponse.data[0]?.completionrate || 75}%`,
        dailyAverageTime: `${Math.floor(Math.random() * 3) + 1} giờ`, // Giả định
        mostCommonError: errors[0]?.name
      };
      
      return {
        studentInfo,
        chapters,
        summaryStats,
        errors,
        suggestions
      };
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